/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { TimeUnit } from "../defs/TimeUnit";
import * as $type from "../utils/Type";

/**
 * Maps time period names to their numeric representations in milliseconds.
 *
 * @ignore Exclude from docs
 */
export let timeUnitDurations: { [Key in TimeUnit]: number } = {
	millisecond: 1,
	second: 1000,
	minute: 60000,
	hour: 3600000,
	day: 86400000,
	week: 604800000,
	month: 2592000000,
	year: 31536000000
};

/**
 * Returns the next time unit that goes after source `unit`.
 *
 * E.g. "hour" is the next unit after "minute", etc.
 *
 * @ignore Exclude from docs
 * @param unit  Source time unit
 * @return Next time unit
 */
export function getNextUnit(unit: TimeUnit): $type.Optional<TimeUnit> {
	switch (unit) {
		case "year":
			return

		case "month":
			return "year";

		case "week":
			return "month";

		case "day":
			return "month"; // not a mistake

		case "hour":
			return "day";

		case "minute":
			return "hour";

		case "second":
			return "minute"

		case "millisecond":
			return "second";
	}
}

/**
 * Returns number of milliseconds in the `count` of time `unit`.
 *
 * Available units: "millisecond", "second", "minute", "hour", "day", "week",
 * "month", and "year".
 *
 * @ignore Exclude from docs
 * @param unit   Time unit
 * @param count  Number of units
 * @return Milliseconds
 */
export function getDuration(unit: TimeUnit, count?: number): number {
	if (!$type.hasValue(count)) {
		count = 1;
	}
	return timeUnitDurations[unit] * count;
}

/**
 * Returns current `Date` object.
 *
 * @return Current date
 */
export function now(): Date {
	return new Date();
}

/**
 * Returns current timestamp.
 *
 * @return Current timestamp
 */
export function getTime(): number {
	return now().getTime();
}

/**
 * Returns a copy of the `Date` object.
 *
 * @ignore Exclude from docs
 * @param date  Source date
 * @return Copy
 */
export function copy(date: Date): Date {
	return new Date(date.getTime()); // todo: check if this is ok. new Date(date) used to strip milliseconds on FF in v3
}

/**
 * Checks if the `unit` part of two `Date` objects do not match. Two dates
 * represent a "range" of time, rather the same time date.
 *
 * @ignore Exclude from docs
 * @param dateOne  Date 1
 * @param dateTwo  Date 2
 * @param unit     Time unit to check
 * @return Range?
 */
export function checkChange(dateOne: Date, dateTwo: Date, unit: TimeUnit): boolean {

	switch (unit) {
		case "year":
			if (dateOne.getFullYear() != dateTwo.getFullYear()) {
				return true;
			}
			break;
		case "month":
			if (dateOne.getMonth() != dateTwo.getMonth()) {
				return true;
			}
			break;

		case "day":
			if (dateOne.getDate() != dateTwo.getDate()) {
				return true;
			}

			break;

		case "hour":
			if (dateOne.getHours() != dateTwo.getHours()) {
				return true;
			}
			break;

		case "minute":
			if (dateOne.getMinutes() != dateTwo.getMinutes()) {
				return true;
			}

			break;

		case "second":
			if (dateOne.getSeconds() != dateTwo.getSeconds()) {
				return true;
			}
			break;

		case "millisecond":
			if (dateOne.getTime() != dateTwo.getTime()) {
				return true;
			}
			break;
	}

	let nextUnit: $type.Optional<TimeUnit> = getNextUnit(unit);
	if (nextUnit) {
		return checkChange(dateOne, dateTwo, nextUnit);
	}
	else {
		return false;
	}

}

/**
 * Adds `count` of time `unit` to the source date. Returns a modified `Date` object.
 *
 * @ignore Exclude from docs
 * @param date   Source date
 * @param unit   Time unit
 * @param count  Number of units to add
 * @return Modified date
 */
export function add(date: Date, unit: TimeUnit, count: number): Date {
	switch (unit) {
		case "day":
			let day: number = date.getUTCDate();
			date.setUTCDate(day + count);
			break;

		case "second":
			let seconds: number = date.getUTCSeconds();
			date.setUTCSeconds(seconds + count);
			break;

		case "millisecond":
			let milliseconds: number = date.getUTCMilliseconds();
			date.setUTCMilliseconds(milliseconds + count);
			break;

		case "hour":
			let hours: number = date.getUTCHours();
			date.setUTCHours(hours + count);
			break;

		case "minute":
			let minutes: number = date.getUTCMinutes();
			date.setUTCMinutes(minutes + count);
			break;

		case "year":
			let year: number = date.getUTCFullYear();
			date.setUTCFullYear(year + count);
			break;

		case "month":
			let month: number = date.getUTCMonth();
			date.setUTCMonth(month + count);
			break;

		case "week":
			let wday: number = date.getUTCDate();
			date.setUTCDate(wday + count * 7);
			break;
	}

	return date;
}

/**
 * "Rounds" the date to specific time unit.
 *
 * @ignore Exclude from docs
 * @param date             Source date
 * @param unit             Time unit
 * @param count            Number of units to round to
 * @param firstDateOfWeek  First day of week
 * @return New date
 */
export function round(date: Date, unit: TimeUnit, count: number, firstDateOfWeek?: number): Date {

	if (!$type.isNumber(count)) {
		count = 1;
	}

	switch (unit) {

		case "day":
			let day = date.getUTCDate();
			if (count > 1) {
				day = Math.floor(day / count) * count;
			}
			day = day;

			date.setUTCDate(day);
			date.setUTCHours(0, 0, 0, 0);

			break;

		case "second":
			let seconds = date.getUTCSeconds();
			if (count > 1) {
				seconds = Math.floor(seconds / count) * count;
			}
			date.setUTCSeconds(seconds, 0);
			break;

		case "millisecond":
			if (count == 1) {
				return date; // much better for perf!
			}

			let milliseconds = date.getUTCMilliseconds();
			milliseconds = Math.floor(milliseconds / count) * count;
			date.setUTCMilliseconds(milliseconds);
			break;

		case "hour":

			let hours = date.getUTCHours();
			if (count > 1) {
				hours = Math.floor(hours / count) * count;
			}
			date.setUTCHours(hours, 0, 0, 0);

			break;

		case "minute":

			let minutes = date.getUTCMinutes();
			milliseconds = date.getUTCMilliseconds();
			if (count > 1) {
				minutes = Math.floor(minutes / count) * count;
			}

			date.setUTCMinutes(minutes, 0, 0);

			break;

		case "month":

			let month = date.getUTCMonth();
			if (count > 1) {
				month = Math.floor(month / count) * count;
			}

			date.setUTCMonth(month, 1);
			date.setUTCHours(0, 0, 0, 0);

			break;

		case "year":

			let year = date.getUTCFullYear();
			if (count > 1) {
				year = Math.floor(year / count) * count;
			}
			date.setUTCFullYear(year, 0, 1);
			date.setUTCHours(0, 0, 0, 0);

			break;


		case "week":

			let wday = date.getUTCDate();
			let weekDay = date.getUTCDay();

			if (!$type.isNumber(firstDateOfWeek)) {
				firstDateOfWeek = 1;
			}

			// todo: rounding when count is not 1
			if (weekDay >= firstDateOfWeek) {
				wday = wday - weekDay + firstDateOfWeek;
			} else {
				wday = wday - (7 + weekDay) + firstDateOfWeek;
			}

			date.setUTCDate(wday);
			date.setUTCHours(0, 0, 0, 0);

			break;
	}

	return date;
}
