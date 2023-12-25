import React, { useState, useCallback, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./picker.module.less";

namespace Locale {
  const Month = "January February March April May June July August September October November December".split(" ");
  export const Locales = {
    zh: {
      weekTitle: "日一二三四五六".split("").map((day) => "周" + day),
      month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      placeholder: "请选择...",
      panelTitle: {
        year: (panelYear: number) => {
          const startYear = Math.floor(panelYear / 10) * 10 - 1;
          return `${startYear} 年 - ${startYear + 12} 年`;
        },
        month: (panelYear: number) => `${panelYear} 年`,
        day: (panelYear: number, panelMonth: number) => `${panelYear} 年 ${panelMonth} 月`,
      },
    },
    en: {
      weekTitle: "Sun Mon Tue Wed Thu Fri Sat".split(" "),
      month: Month.map((ele) => ele.substring(0, 3)),
      placeholder: "select...",
      panelTitle: {
        year: (panelYear: number) => {
          const startYear = Math.floor(panelYear / 10) * 10 - 1;
          return `${startYear} - ${startYear + 12}`;
        },
        month: (panelYear: number) => `${panelYear}`,
        day: (panelYear: number, panelMonth: number) => `${Month[panelMonth - 1]} ${panelYear}`,
      },
    },
  } as const;
}

interface InnerPickerProps {
  panelYear: number;
  panelMonth: number;
  currentYear: number;
  currentMonth: number;
  currentDay: number;
  activeYear: number;
  activeMonth: number;
  activeDay: number;
  locale: keyof typeof Locale.Locales;
  rule: (year: number, month: number, day: number) => boolean;
}

namespace DateUtils {
  export function GetPrevMonthDayCount(year: number, month: number) {
    const date = new Date();
    date.setFullYear(year);
    date.setMonth(month - 1);
    date.setDate(1);
    let prevDays = date.getDay();
    if (!prevDays) prevDays = 7;
    return prevDays;
  }

  export function GetPrevYearMonth(year: number, month: number): [number, number] {
    return month === 1 ? [year - 1, 12] : [year, month - 1];
  }

  export function GetNextYearMonth(year: number, month: number): [number, number] {
    return month === 12 ? [year + 1, 1] : [year, month + 1];
  }

  const MonthDayCountMinus30 = [1, -2, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1];
  export function GetMonthDayCount(year: number, month: number) {
    const isLeap = month === 2 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    return MonthDayCountMinus30[month - 1] + 30 + (isLeap ? 1 : 0);
  }

  const WeekCharMap = {
    "0": "/u65e5",
    "1": "/u4e00",
    "2": "/u4e8c",
    "3": "/u4e09",
    "4": "/u56db",
    "5": "/u4e94",
    "6": "/u516d",
  } as const;

  const DateFormat = function DateFormat(this: Date, fmt: string) {
    const o = {
      "M+": this.getMonth() + 1, // 月份
      "d+": this.getDate(), // 日
      "h+": this.getHours() % 12 === 0 ? 12 : this.getHours() % 12, // 小时
      "H+": this.getHours(), // 小时
      "m+": this.getMinutes(), // 分
      "s+": this.getSeconds(), // 秒
      "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
      S: this.getMilliseconds(), // 毫秒
    } as const;
    const yearMatch = /(y+)/.exec(fmt);
    if (yearMatch) {
      fmt = fmt.replace(yearMatch[1], (this.getFullYear() + "").substring(4 - yearMatch[1].length));
    }
    const EMatch = /(E+)/.exec(fmt);
    if (EMatch) {
      fmt = fmt.replace(EMatch[1], (EMatch[1].length > 1 ? (EMatch[1].length > 2 ? "/u661f/u671f" : "/u5468") : "") + WeekCharMap[(this.getDay() + "") as keyof typeof WeekCharMap]);
    }
    for (const k in o) {
      const match = new RegExp("(" + k + ")").exec(fmt);
      if (match) {
        const key = k as keyof typeof o;
        const replace: string = match[1].length === 1 ? "" + o[key] : ("00" + o[key]).substr(("" + o[key]).length);
        fmt = fmt.replace(match[1], replace);
      }
    }
    return fmt;
  };

  export function FormatDate(date: Date | number, fmt: string) {
    if (!date || isNaN(+date)) {
      return "";
    }
    fmt = fmt || "yyyy-MM-dd HH:mm:ss";
    return DateFormat.call(date instanceof Date ? date : new Date(+date), fmt);
  }
}

const BindCellClick =
  <T extends unknown[]>(callback: (...args: T) => void, ...args: T) =>
  (event: React.MouseEvent) => {
    event.stopPropagation();
    callback.apply(this, args);
  };

const DayPicker = React.memo(function DayPicker(
  props: InnerPickerProps & {
    onCellSelect: (year: number, month: number, day: number) => void;
  }
) {
  const { panelYear, panelMonth, currentYear, currentMonth, currentDay, activeYear, activeMonth, activeDay, onCellSelect } = props;

  const pCount = DateUtils.GetPrevMonthDayCount(panelYear, panelMonth);
  const cCount = DateUtils.GetMonthDayCount(panelYear, panelMonth);
  const nCount = 42 - pCount - cCount;
  const pMonthArray = DateUtils.GetPrevYearMonth(panelYear, panelMonth);
  const nMonthArray = DateUtils.GetNextYearMonth(panelYear, panelMonth);
  const pStartDate = DateUtils.GetMonthDayCount.apply(null, pMonthArray) - pCount + 1;

  const cellArray: React.ReactElement[] = [];

  let keyIndex = 0;

  const getCellElement = (year: number, month: number, day: number, classNames: string[]) => {
    const classArray = ["cell", "small"].concat(classNames);
    const validate = props.rule(year, month, day) !== false;
    if (validate === false) classArray.push("disabled");
    if (year === currentYear && month === currentMonth && day === currentDay) classArray.push("current");
    if (year === activeYear && month === activeMonth && day === activeDay) classArray.push("active");

    return (
      <td key={keyIndex++} className={classArray.map((className) => styles[className]).join(" ")} onClick={validate !== false ? BindCellClick(onCellSelect, year, month, day) : undefined}>
        {day}
      </td>
    );
  };

  for (let i = 0; i < pCount; i++) {
    cellArray.push(getCellElement(pMonthArray[0], pMonthArray[1], pStartDate + i, ["old"]));
  }

  for (let i = 0; i < cCount; i++) {
    cellArray.push(getCellElement(panelYear, panelMonth, i + 1, []));
  }

  for (let i = 0; i < nCount; i++) {
    cellArray.push(getCellElement(nMonthArray[0], nMonthArray[1], i + 1, ["new"]));
  }

  const tableRows: React.ReactElement[] = [];
  for (let i = 0; i < 6; i++) {
    const oneRow: React.ReactElement[] = [];
    for (let j = 0; j < 7; j++) {
      oneRow.push(cellArray[7 * i + j]);
    }
    tableRows.push(<tr key={i}>{oneRow}</tr>);
  }
  return <tbody>{tableRows}</tbody>;
});

const MonthPicker = React.memo(function MonthPicker(
  props: InnerPickerProps & {
    onCellSelect: (year: number, month: number) => void;
  }
) {
  const { panelYear, currentYear, currentMonth, activeYear, activeMonth, locale: lang, onCellSelect } = props;

  const cellArray: React.ReactElement[] = [];

  let keyIndex = 0;

  const language = Locale.Locales[lang] || Locale.Locales.en;

  const getCellElement = (year: number, month: number, classNames: string[]) => {
    const classArray = ["cell", "large"].concat(classNames);
    if (year === currentYear && month === currentMonth) classArray.push("current");
    if (year === activeYear && month === activeMonth) classArray.push("active");

    return (
      <div key={keyIndex++} className={classArray.map((className) => styles[className]).join(" ")} onClick={BindCellClick(onCellSelect, year, month)}>
        <span>{language.month[month - 1]}</span>
      </div>
    );
  };

  for (let i = 0; i < 12; i++) {
    cellArray.push(getCellElement(panelYear, i + 1, []));
  }

  const tableRows: React.ReactElement[] = [];
  for (let i = 0; i < 3; i++) {
    const oneRow: React.ReactElement[] = [];
    for (let j = 0; j < 4; j++) {
      oneRow.push(cellArray[4 * i + j]);
    }
    tableRows.push(
      <tr key={i}>
        <td colSpan={7}>{oneRow}</td>
      </tr>
    );
  }

  return <tbody>{tableRows}</tbody>;
});

const YearPicker = React.memo(function YearPicker(
  props: InnerPickerProps & {
    onCellSelect: (year: number) => void;
  }
) {
  const { panelYear, currentYear, activeYear, onCellSelect } = props;

  const cellArray: React.ReactElement[] = [];

  let keyIndex = 0;

  const getCellElement = (year: number, classNames: string[]) => {
    const classArray = ["cell", "large"].concat(classNames);
    if (year === currentYear) classArray.push("current");
    if (year === activeYear) classArray.push("active");

    return (
      <div key={keyIndex++} className={classArray.map((className) => styles[className]).join(" ")} onClick={BindCellClick(onCellSelect, year)}>
        <span>{year}</span>
      </div>
    );
  };

  const startYear = Math.floor(panelYear / 10) * 10 - 1;

  for (let i = 0; i < 12; i++) {
    cellArray.push(getCellElement(startYear + i, i === 0 ? ["old"] : i === 11 ? ["new"] : []));
  }

  const tableRows: React.ReactElement[] = [];
  for (let i = 0; i < 3; i++) {
    const oneRow: React.ReactElement[] = [];
    for (let j = 0; j < 4; j++) {
      oneRow.push(cellArray[4 * i + j]);
    }
    tableRows.push(
      <tr key={i}>
        <td colSpan={7}>{oneRow}</td>
      </tr>
    );
  }

  return <tbody>{tableRows}</tbody>;
});

interface PickerProps {
  date?: {
    year: number;
    month: number;
    day: number;
  };
  onSelect: (year: number, month: number, day: number) => void;
  rule: (year: number, month: number, day: number) => boolean;
  width: number;
  locale: keyof typeof Locale.Locales;
}

enum PickerType {
  Day,
  Month,
  Year,
}

function FixDateObject(
  dateObject:
    | {
        year: number;
        month: number;
        day: number;
      }
    | undefined
) {
  const currentDate = new Date();
  let year: number;
  let month: number;
  let day: number;
  if (!dateObject) {
    year = currentDate.getFullYear();
    month = currentDate.getMonth() + 1;
    day = day = currentDate.getDate();
  } else {
    year = dateObject.year;
    month = dateObject.month;
    day = dateObject.day;
  }
  return {
    year,
    month,
    day,
  };
}

const FuncKeys = ["day", "month", "year"] as const;

const DateObjectEqual = (a: PickerProps["date"], b: PickerProps["date"]) => {
  let result = true;
  if (typeof a === "undefined" || typeof b === "undefined") {
    result = a === b;
  } else {
    if (a.year !== b.year || a.month !== b.month || a.day !== b.day) {
      result = false;
    }
  }
  return result;
};

const ShallowEqual = <T extends object>(a: T, b: T, c?: Partial<{ [K in keyof T]: (a: T[K], b: T[K]) => boolean }>) => {
  for (const key in a) {
    const comp = c ? c[key] : undefined;
    if (!comp) {
      if (a[key] !== b[key]) {
        return false;
      }
    } else if (!comp(a[key], b[key])) {
      return false;
    }
  }
  return true;
};

const Picker = React.memo(
  function Picker(props: PickerProps) {
    const [panel, setPanel] = useState(PickerType.Day);
    const dateInfo = useMemo(() => FixDateObject(props.date), [props.date]);

    const [panelInfo, setPanelInfo] = useState(() => ({
      panelYear: dateInfo.year,
      panelMonth: dateInfo.month,
    }));

    const [currentDateInfo, setCurrentDateInfo] = useState(() => {
      const currentDate = new Date();
      return {
        currentYear: currentDate.getFullYear(),
        currentMonth: currentDate.getMonth() + 1,
        currentDay: currentDate.getDate(),
      };
    });

    const currentDateInfoRef = useRef<typeof currentDateInfo>();
    currentDateInfoRef.current = currentDateInfo;

    useEffect(() => {
      const id = setInterval(() => {
        const newDate = new Date();
        const newDateInfo = {
          currentYear: newDate.getFullYear(),
          currentMonth: newDate.getMonth() + 1,
          currentDay: newDate.getDate(),
        };
        if (!currentDateInfoRef.current || !ShallowEqual(newDateInfo, currentDateInfoRef.current)) {
          setCurrentDateInfo(newDateInfo);
        }
      }, 1000);
      return () => {
        clearInterval(id);
      };
    }, []);

    const onTitleClick = useCallback((event: React.SyntheticEvent) => {
      event.stopPropagation();
      setPanel((x) => (x === PickerType.Day || x === PickerType.Month ? x + 1 : x));
    }, []);

    const onArrowClick = useCallback(
      (event: React.SyntheticEvent, step: -1 | 1) => {
        event.stopPropagation();
        if (panel === PickerType.Day) {
          setPanelInfo((prevDateInfo) => {
            const switchedArray = (step < 0 ? DateUtils.GetPrevYearMonth : DateUtils.GetNextYearMonth)(prevDateInfo.panelYear, prevDateInfo.panelMonth);
            return {
              panelYear: switchedArray[0],
              panelMonth: switchedArray[1],
            };
          });
        } else if (panel === PickerType.Month) {
          setPanelInfo((prevDateInfo) => ({
            panelYear: prevDateInfo.panelYear + step,
            panelMonth: prevDateInfo.panelMonth,
          }));
        } else {
          setPanelInfo((prevDateInfo) => ({
            panelYear: prevDateInfo.panelYear + 10 * step,
            panelMonth: prevDateInfo.panelMonth,
          }));
        }
      },
      [panel]
    );

    const onSelect = props.onSelect;
    const onDaySelect = useCallback(
      (year: number, month: number, day: number) => {
        setPanelInfo({
          panelYear: year,
          panelMonth: month,
        });
        onSelect(year, month, day);
      },
      [onSelect]
    );

    const onMonthSelect = useCallback((year: number, month: number) => {
      setPanelInfo((prevDateInfo) => ({
        panelYear: prevDateInfo.panelYear,
        panelMonth: month,
      }));
      setPanel(PickerType.Day);
    }, []);

    const onYearSelect = useCallback((year: number) => {
      setPanelInfo((prevDateInfo) => ({
        panelYear: year,
        panelMonth: prevDateInfo.panelMonth,
      }));
      setPanel(PickerType.Month);
    }, []);

    const getTitleElement = () => {
      const { panelYear, panelMonth } = panelInfo;
      const language = Locale.Locales[props.locale];
      const funcType: "day" | "month" | "year" = FuncKeys[panel];
      return <span>{language.panelTitle[funcType](panelYear, panelMonth)}</span>;
    };

    const panelProps = {
      activeYear: dateInfo.year,
      activeMonth: dateInfo.month,
      activeDay: dateInfo.day,
      ...currentDateInfo,
      ...panelInfo,
      rule: props.rule,
      locale: props.locale,
    };

    const getBodyElement = () => {
      if (panel === PickerType.Year) {
        return <YearPicker {...panelProps} onCellSelect={onYearSelect} />;
      } else if (panel === PickerType.Month) {
        return <MonthPicker {...panelProps} onCellSelect={onMonthSelect} />;
      } else {
        return <DayPicker {...panelProps} onCellSelect={onDaySelect} />;
      }
    };

    const getWeekTitleElement = () => {
      if (panel === PickerType.Day) {
        const language = Locale.Locales[props.locale];
        const width = props.width / 7;
        return (
          <tr>
            {language.weekTitle.map((title, index) => (
              <th style={{ width: width }} key={index}>
                {title}
              </th>
            ))}
          </tr>
        );
      }
      return null;
    };

    return (
      <table>
        <thead>
          <tr>
            <th onClick={(event) => onArrowClick(event, -1)}>
              <span>&lt;&nbsp;</span>
            </th>
            <th colSpan={5} onClick={onTitleClick}>
              <div key="title">{getTitleElement()}</div>
            </th>
            <th onClick={(event) => onArrowClick(event, 1)}>
              <span>&nbsp;&gt;</span>
            </th>
          </tr>
          {getWeekTitleElement()}
        </thead>
        {getBodyElement()}
      </table>
    );
  },
  (prev, current) => ShallowEqual(prev, current, { date: DateObjectEqual })
);

function GetDateText(
  dateInfo:
    | {
        year: number;
        month: number;
        day: number;
      }
    | undefined,
  locale: keyof typeof Locale.Locales,
  format: string
) {
  const language = Locale.Locales[locale];
  if (!dateInfo) return language.placeholder;
  const dateObject = new Date();
  dateObject.setFullYear(dateInfo.year);
  dateObject.setMonth(dateInfo.month - 1);
  dateObject.setDate(dateInfo.day);
  dateObject.setHours(0);
  dateObject.setMinutes(0);
  dateObject.setSeconds(0);
  dateObject.setMilliseconds(0);
  return DateUtils.FormatDate(dateObject, format);
}

const DatePicker = React.memo(function DatePicker(props: DatePickerMixin.PropTypes) {
  const { date, fontSize, locale, format, onSelect, rule, closeOnSelect } = { ...DatePickerMixin.defaultProps, ...props };
  const [dateInfo, setDateInfo] = useState(() => FixDateObject(date));
  const dateText = useMemo(() => GetDateText(dateInfo, locale, format), [dateInfo, locale, format]);
  const inputRef = useRef<HTMLSpanElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const thisNode = inputRef.current;
      const pickerNode = pickerRef.current;
      if (!thisNode || !pickerNode) {
        return;
      }
      if (event.target && (thisNode.contains(event.target as Node) || pickerNode.contains(event.target as Node))) {
        if (pickerNode.style.display !== "block") {
          pickerNode.style.display = "block";
        } else {
          pickerNode.style.display = "none";
        }
      } else {
        pickerNode.style.display = "none";
      }
    };
    window.addEventListener("click", onDocumentClick, false);
    return () => {
      window.removeEventListener("click", onDocumentClick, false);
    };
  }, []);

  const onPickerSelect = useCallback(
    (year: number, month: number, day: number) => {
      setDateInfo({ year, month, day });
      if (closeOnSelect) {
        pickerRef.current && (pickerRef.current.style.display = "none");
      }
      onSelect(year, month, day);
    },
    [onSelect, closeOnSelect]
  );

  return (
    <span ref={inputRef} className={styles["date-picker"]}>
      <div className={styles.input} style={{ width: fontSize * 21, fontSize }}>
        <span style={{ padding: `0 ${fontSize}px` }}>{dateText}</span>
      </div>
      <div style={{ position: "relative" }}>
        <div ref={pickerRef} className={styles["date-picker-drop-down"]} style={{ width: fontSize * 21, fontSize }}>
          <Picker locale={locale} width={fontSize * 21} date={dateInfo} rule={rule} onSelect={onPickerSelect} />
        </div>
      </div>
    </span>
  );
});

namespace DatePickerMixin {
  export interface PropTypes {
    fontSize?: number;
    closeOnSelect?: boolean;
    date?: {
      year: number;
      month: number;
      day: number;
    };
    onSelect?: (year: number, month: number, day: number) => void;
    rule?: (year: number, month: number, day: number) => boolean;
    format?: string;
    locale?: keyof typeof Locale.Locales;
  }

  const PICKER_DUMMY_FUNC = () => true;

  type PartialRequired<T, S extends keyof T> = Required<Omit<T, S>> & Omit<T, Exclude<keyof T, S>>;

  type DefaultPropType = PartialRequired<PropTypes, "date">;

  export const defaultProps: DefaultPropType = {
    fontSize: 12,
    closeOnSelect: true,
    onSelect: PICKER_DUMMY_FUNC,
    rule: PICKER_DUMMY_FUNC,
    format: "yyyy-MM-dd",
    locale: "zh",
  };
}

export default Object.assign(DatePicker, DatePickerMixin);
