/**
 * Defines WordCloud series.
 */

/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesProperties, ISeriesDataFields, ISeriesAdapters, ISeriesEvents } from "../../charts/series/Series";
import { Sprite } from "../../core/Sprite";
import { Container } from "../../core/Container";
import { Label } from "../../core/elements/Label";
import { ListTemplate, ListDisposer } from "../../core/utils/List";
import { Animation } from "../../core/utils/Animation";
import { color } from "../../core/utils/Color";
import { ColorSet } from "../../core/utils/ColorSet";
import { registry } from "../../core/Registry";
import { IPoint } from "../../core/defs/IPoint";
import { WordCloud } from "./WordCloud";
import * as $type from "../../core/utils/Type";
import * as $path from "../../core/rendering/Path";
import * as $utils from "../../core/utils/Utils";
import * as $math from "../../core/utils/Math";
import * as $dom from "../../core/utils/DOM";
import { Percent, percent } from "../../core/utils/Percent";
import { IDisposer, Disposer } from "../../core/utils/Disposer";


/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */

//@todo: sequenced?

/**
 * Defines a [[DataItem]] for [[WordCloudSeries]].
 *
 * @see {@link DataItem}
 */
export class WordCloudSeriesDataItem extends SeriesDataItem {

	/**
	 * A reference to a word label element.
	 *
	 * @ignore Exclude from docs
	 */
	public _label: Label;

	/**
	 * Defines a type of [[Component]] this data item is used for.
	 */
	public _component!: WordCloudSeries;

	/**
	 * Constructor
	 */
	constructor() {
		super();
		this.className = "WordCloudSeriesDataItem";

		this.applyTheme();
	}

	/**
	 * Hide the data item (and corresponding visual elements).
	 *
	 * @param  duration  Duration (ms)
	 * @param  delay     Delay hiding (ms)
	 * @param  toValue   Target value for animation
	 * @param  fields    Fields to animate while hiding
	 */
	public hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation> {
		if (!fields) {
			fields = ["value"];
		}
		return super.hide(duration, delay, 0, fields);
	}

	/**
	 * Sets visibility of the Data Item.
	 *
	 * @param value Data Item
	 */
	public setVisibility(value: boolean, noChangeValues?: boolean): void {
		if (!noChangeValues) {
			if (value) {
				this.setWorkingValue("value", this.values["value"].value, 0, 0);
			}
			else {
				this.setWorkingValue("value", 0, 0, 0);
			}
		}

		super.setVisibility(value, noChangeValues);
	}

	/**
	 * Show hidden data item (and corresponding cisual elements).
	 *
	 * @param duration  Duration (ms)
	 * @param delay     Delay hiding (ms)
	 * @param fields    Fields to animate while hiding
	 */
	public show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation> {
		if (!fields) {
			fields = ["value"];
		}
		return super.show(duration, delay, fields);
	}

	/**
	 * The word.
	 *
	 * @param  value  Word
	 */
	public set word(value: string) {
		this.setProperty("word", value);
	}

	/**
	 * @return Word
	 */
	public get word(): string {
		return this.properties.word;
	}

	/**
	 * A [Label] element, related to this data item (word).
	 *
	 * @readonly
	 * @return Label element
	 */
	public get label(): this["_label"] {
		if (!this._label) {
			let label = this.component.labels.create();
			this._label = label;

			this._disposers.push(label);
			label.parent = this.component.labelsContainer;
			label.isMeasured = false;
			label.x = percent(50);
			label.y = percent(50);
			label.fontSize = 0;

			if (this.component.colors) {
				label.fill = this.component.colors.next();
			}

			this._disposers.push(new Disposer(() => {
				if (this.component) {
					this.component.labels.removeValue(label);
				}
			}));

			this.addSprite(label);
			label.visible = this.visible;
		}
		return this._label;
	}

}


/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */

/**
 * Defines data fields for [[WordCloudSeries]].
 */
export interface IWordCloudSeriesDataFields extends ISeriesDataFields {

	/**
	 * Name of the field in data that holds word.
	 */
	word?: string;

}

/**
 * Defines properties for [[WordCloudSeries]].
 */
export interface IWordCloudSeriesProperties extends ISeriesProperties {

	/**
	 * A color set to be used for words.
	 */
	colors?: ColorSet;

	/**
	 * Source text from which words are extracted.
	 */
	text?: string;

	/**
	 * Absolute or relative font size for the smallest words.
	 */
	minFontSize?: number | Percent;

	/**
	 * Absolute or relative font size for the biggest words.
	 */
	maxFontSize?: number | Percent;

	/**
	 * Minimum occurances for a word to be included into cloud.
	 */
	minValue?: number;

	/**
	 * Maximum number of words to show.
	 */
	maxCount?: number;

	/**
	 * Array of words  exclude from cloud.
	 */
	excludeWords?: string[];

	/**
	 * Randomness of word placement (0-1).
	 */
	randomness?: number;

	/**
	 * Minimum number of characters for a word to be included in the cloud.
	 */
	minWordLength?: number;

	/**
	 * An array of possible rotation angles for words.
	 */
	angles?: number[];

	/**
	 * If word's relative height is bigger than this, it won't be rotated.
	 */
	rotationThreshold?: number;

	/**
	 * Step for next word placement.
	 */
	step?: number;

	/**
	 * Accuracy of overlapping check.
	 */
	accuracy?: number;
}

/**
 * Defines events for [[WordCloudSeries]].
 */
export interface IWordCloudSeriesEvents extends ISeriesEvents { }

/**
 * Defines adapters for [[WordCloudSeries]].
 *
 * @see {@link Adapter}
 */
export interface IWordCloudSeriesAdapters extends ISeriesAdapters, IWordCloudSeriesProperties { }


/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */

/**
 * Defines [[WordCloudSeries]] which is a base class for [[PieSeries]],
 * [[FunnelSeries]], and [[PyramidSeries]].
 *
 * @see {@link IWordCloudSeriesEvents} for a list of available Events
 * @see {@link IWordCloudSeriesAdapters} for a list of available Adapters
 */
export class WordCloudSeries extends Series {
	/**
	 * Defines type of the label elements for the series.
	 *
	 * @ignore Exclude from docs
	 */
	public _label: Label;

	/**
	 * A reference to chart this series is for.
	 *
	 * @ignore Exclude from docs
	 */
	public _chart: WordCloud;

	/**
	 * Defines the type of data fields used for the series.
	 */
	public _dataFields: IWordCloudSeriesDataFields;

	/**
	 * Defines available properties.
	 */
	public _properties!: IWordCloudSeriesProperties;

	/**
	 * Defines available adapters.
	 */
	public _adapter!: IWordCloudSeriesAdapters;

	/**
	 * Defines available events.
	 */
	public _events!: IWordCloudSeriesEvents;

	/**
	 * Defines the type of data item.
	 */
	public _dataItem: WordCloudSeriesDataItem;

	/**
	 * List of label elements.
	 */
	protected _labels: ListTemplate<this["_label"]>;

	protected _ctx: CanvasRenderingContext2D;

	protected _canvas: HTMLCanvasElement;

	protected _spiral: Sprite;

	protected _points: IPoint[];

	protected _adjustedFont: number = 1;

	protected _processTimeout: IDisposer;

	protected _currentIndex: number;

	/**
	 * Holds a Sprite that acts as an intelligent mask for the serries.
	 */
	protected _maskSprite: Sprite;

	/**
	 * Container label elements are put in.
	 */
	public labelsContainer: Container;

	/**
	 * Constructor
	 */
	constructor() {
		super();

		this.className = "WordCloudSeries";

		// Disabled
		// this.colors = new ColorSet();
		// this.colors.step = 1;
		// this.colors.passOptions = {}; // makes it loop

		this.accuracy = 5;

		this.isMeasured = true;

		this.minFontSize = percent(2);
		this.maxFontSize = percent(20);

		this.excludeWords = [];

		this.layout = "absolute";

		this.angles = [0, 0, 90];

		//this.maxCount = 100;
		this.rotationThreshold = 0.7;
		this.minWordLength = 1;

		this.width = percent(100);
		this.height = percent(100);

		this.step = 15;

		this.randomness = 0.2;

		this.labels.template.horizontalCenter = "middle";
		this.labels.template.verticalCenter = "middle";

		// Accessibility
		this.itemReaderText = "{word}: {value}";

		this.applyTheme();

		let canvas = document.createElement("canvas");
		canvas.style.position = "absolute";
		canvas.style.top = "0px";
		canvas.style.left = "0px";
		canvas.style.opacity = "0.5";
		//document.body.appendChild(canvas);
		this._canvas = canvas;

		this._ctx = canvas.getContext("2d");

		this._maskSprite = this.createChild(Sprite);

		let labelsContainer = this.createChild(Container);
		labelsContainer.shouldClone = false;
		labelsContainer.isMeasured = false;
		labelsContainer.layout = "none";
		this.labelsContainer = labelsContainer;

		this._spiral = labelsContainer.createChild(Sprite);
		this._spiral.fillOpacity = 0.1;
		this._spiral.strokeOpacity = 1;
		this._spiral.stroke = color("#000");


		//this._maskSprite.visible = false;
	}

	/**
	 * Validates data range.
	 *
	 * @ignore
	 */
	public validateDataRange(): void {
		super.validateDataRange();
		this.dataItems.each((dataItem) => {
			$utils.used(dataItem.label);
		})
	}

	/**
	 * Validates element.
	 *
	 * @ignore
	 */
	public validate(): void {

		super.validate();

		this._currentIndex = 0;

		this.dataItems.values.sort(function(a, b) {
			if (a.value == b.value) {
				return 0;
			}
			else if (a.value > b.value) {
				return -1;
			}
			else {
				return 1;
			}
		});


		if (this._processTimeout) {
			this._processTimeout.dispose();
		}

		let w = this.innerWidth;
		let h = this.innerHeight;
		if (w > 0 && h > 0) {

			let context = this._ctx;

			this._canvas.width = w;
			this._canvas.height = h;

			context.fillStyle = "white";
			context.fillRect(0, 0, w, h);

			this._points = $path.spiralPoints(0, 0, w, h, 0, this.step, this.step);

			let angle = this.labelsContainer.rotation;

			for (let i = this._points.length - 1; i >= 0; i--) {
				let point = this._points[i];

				if (point.x < -w / 2 || point.x > w / 2 || point.y < -h / 2 || point.y > h / 2) {
					this._points.splice(i, 1);
					continue;
				}

				if (angle != 0) {
					let point2 = $utils.spritePointToSprite({ x: point.x + w / 2, y: point.y + h / 2 }, this, this.labelsContainer);
					point.x = point2.x;
					point.y = point2.y;
				}
			}

			//this._spiral.path = $path.pointsToPath(this._points);


			let maskSprite = this._maskSprite;

			if (maskSprite.path) {
				let maxWidth = this.maxWidth;
				let maxHeight = this.maxHeight;

				maskSprite.isMeasured = true;
				maskSprite.validate();

				let pictureWidth = maskSprite.measuredWidth / maskSprite.scale;
				let pictureHeight = maskSprite.measuredHeight / maskSprite.scale;

				let scale = $math.min(maxHeight / pictureHeight, maxWidth / pictureWidth);

				if (scale == Infinity) {
					scale = 1; // can't return here, won't draw legend properly
				}

				maskSprite.horizontalCenter = "none";
				maskSprite.verticalCenter = "none";
				maskSprite.x = 0;
				maskSprite.y = 0;
				maskSprite.scale = 1;

				scale = $math.max(0.001, scale);

				maskSprite.horizontalCenter = "middle";
				maskSprite.verticalCenter = "middle";
				maskSprite.x = w / 2;
				maskSprite.y = h / 2;
				maskSprite.validatePosition();

				this.mask = maskSprite;
				/*
				context.fillStyle = "blue";
				context.fillRect(0, 0, w, h);
				context.fillStyle = "white";
				context.scale(scale, scale);

				context.translate(maskSprite.maxLeft - maxLeft + w / 2 / scale, maskSprite.maxTop - maxTop + h / 2 / scale);
				//let commandList = this.svgPathToCommands(maskSprite.path);
				//this.drawSvgPath(context, commandList);
				let p = new Path2D(maskSprite.path);
				context.stroke(p);
				context.fill(p);
				context.translate(-maskSprite.maxLeft + maxLeft - w / 2 / scale, -maskSprite.maxTop + maxTop - h / 2 / scale);
				context.scale(1 / scale, 1 / scale);
				*/

				maskSprite.scale = scale;
			}

			this.processItem(this.dataItems.getIndex(this._currentIndex));
		}
	}

	/**
	 * [processItem description]
	 *
	 * @param   dataItem  Data item
	 */
	protected processItem(dataItem: this["_dataItem"]) {

		let context = this._ctx;

		let w = this.innerWidth;
		let h = this.innerHeight;

		this.labelsContainer.x = w / 2;
		this.labelsContainer.y = h / 2;

		let label = dataItem.label;
		let fontFace = $dom.findFont(label.element.node);

		let smallerSize = $math.min(this.innerHeight, this.innerWidth);
		let minFontSize = $utils.relativeToValue(this.minFontSize, smallerSize);
		let maxFontSize = $utils.relativeToValue(this.maxFontSize, smallerSize);

		let percent = (dataItem.value - this.dataItem.values.value.low) / this.dataItem.values.value.high;

		let fontSize = minFontSize + (maxFontSize - minFontSize) * percent * this._adjustedFont;

		let initialFontSize = label.fontSize;
		label.fontSize = fontSize;

		let angle = 0;
		if ((fontSize - minFontSize) / (maxFontSize - minFontSize) < this.rotationThreshold) {
			angle = this.angles[Math.round(Math.random() * (this.angles.length - 1))];
		}

		label.fontSize = fontSize;
		label.rotation = angle;
		label.show(0);
		label.hardInvalidate();
		label.validate();

		let maxL = label.maxLeft;
		let maxR = label.maxRight;
		let maxT = label.maxTop;
		let maxB = label.maxBottom;

		let intersects = true;

		let p = Math.round(Math.random() * this._points.length * this.randomness);

		let initialX = label.pixelX;
		let initialY = label.pixelY;

		let x = 0;
		let y = 0;

		// TODO is this needed ?
		$utils.used(this.labelsContainer.rotation);

		while (intersects) {
			if (p > this._points.length - 1) {
				intersects = false;
				this._adjustedFont -= 0.1;
				this.invalidate();
				return;
			}

			intersects = false;

			x = this._points[p].x;
			y = this._points[p].y;

			let marginLeft = label.pixelMarginLeft;
			let marginRight = label.pixelMarginRight;
			let marginTop = label.pixelMarginTop;
			let marginBottom = label.pixelMarginBottom;

			let rect1 = { x: x + maxL - marginLeft, y: y + maxT - marginTop, width: maxR - maxL + marginLeft + marginRight, height: maxB - maxT + marginTop + marginBottom };

			let pixel = this._ctx.getImageData(rect1.x + w / 2, rect1.y + h / 2, rect1.width, rect1.height).data;
			for (let i = 0; i < pixel.length; i += Math.pow(2, this.accuracy)) {
				if (pixel[i] != 255) {
					intersects = true;
					if (label.currentText.length > 3) {
						if (angle == 0) {
							if (maxR - maxL < 60) {
								this._points.splice(p, 1);
							}
						}
						if (Math.abs(angle) == 90) {
							if (maxB - maxT < 50) {
								this._points.splice(p, 1);
							}
						}
					}

					break;
				}
			}
			p += 5;
		}
		if (initialFontSize == 0) {
			label.animate([{ property: "fontSize", to: fontSize, from: initialFontSize }], this.interpolationDuration, this.interpolationEasing);
			label.x = x;
			label.y = y;
		}
		else {
			label.animate([{ property: "fontSize", to: fontSize, from: initialFontSize }, { property: "x", to: x, from: initialX }, { property: "y", to: y, from: initialY }], this.interpolationDuration, this.interpolationEasing);
		}

		let cx = x + w / 2;
		let cy = y + h / 2;

		context.translate(cx, cy);
		let radAngle = label.rotation * Math.PI / 180;
		context.rotate(radAngle);
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "blue";
		context.font = fontSize + "px " + fontFace;
		context.fillText(label.currentText, 0, 0);
		context.rotate(-radAngle);
		context.translate(-cx, -cy);

		if (label.showOnInit) {
			label.hide(0);
			label.show();
		}

		if (this._currentIndex < this.dataItems.length - 1) {
			this._processTimeout = this.setTimeout(() => {
				this._currentIndex++;
				this.processItem(this.dataItems.getIndex(this._currentIndex));
			}, 10);
		}
	}

	/**
	 * Sreates label element.
	 *
	 * @return label
	 */
	protected createLabel(): this["_label"] {
		return new Label();
	}

	/**
	 * [[Label]] elements representing each word.
	 *
	 * @return  Label elements
	 */
	public get labels(): ListTemplate<this["_label"]> {
		if (!this._labels) {
			let label = this.createLabel();
			label.applyOnClones = true;
			this._disposers.push(label);

			label.text = "{word}";
			label.margin(2, 3, 2, 3);
			label.padding(0, 0, 0, 0);

			this._labels = new ListTemplate(label);
			this._disposers.push(new ListDisposer(this._labels));
		}
		return this._labels;
	}

	/**
	 * Returns a new/empty DataItem of the type appropriate for this object.
	 *
	 * @see {@link DataItem}
	 * @return Data Item
	 */
	protected createDataItem(): this["_dataItem"] {
		return new WordCloudSeriesDataItem();
	}

	/**
	 * A color set to be used for each new word.
	 *
	 * By default it's empty, so all words will be colored the same.
	 *
	 * If you want to automatically color each word differently, set this
	 * to a new instance of a [[ColorSet]].
	 *
	 * ```TypeScript
	 * series.colors = new am4core.ColorSet();
	 * series.colors.step = 1;
	 * series.colors.passOptions = {}; // makes it loop
	 * ```
	 * ```JavaScript
	 * series.colors = new am4core.ColorSet();
	 * series.colors.step = 1;
	 * series.colors.passOptions = {}; // makes it loop
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "colors": {
	 *       "type": "ColorSet",
	 *       "step": 1,
	 *       "passOptions": {}
	 *     }
	 *   }]
	 * }
	 * ```
	 *
	 * @param  value  Color set
	 */
	public set colors(value: ColorSet) {
		this.setPropertyValue("colors", value, true);
	}

	/**
	 * @return Color set
	 */
	public get colors(): ColorSet {
		return this.getPropertyValue("colors");
	}

	/**
	 * [updateData description]
	 */
	protected updateData(): void {
		this.data = this.getWords(this.text);
	}

	/**
	 * A source text to build word cloud from.
	 *
	 * @param  value  Source text
	 */
	public set text(value: string) {
		if (this.setPropertyValue("text", value)) {
			this.updateData();
		}
	}

	/**
	 * @return Source text
	 */
	public get text(): string {
		return this.getPropertyValue("text");
	}

	/**
	 * Maximum number of words to show.
	 *
	 * If ther are more words in the cloud than `maxCount`, smallest words will
	 * be discarded.
	 *
	 * NOTE: this setting is used only when you set whole text using `text`. If
	 * you set `chart.data` or `series.data` directly, it won't have any effect.
	 *
	 * @param  value  Maximum words to show
	 */
	public set maxCount(value: number) {
		if (this.setPropertyValue("maxCount", value)) {
			this.updateData();
		}
	}

	/**
	 * @return Maximum words to show
	 */
	public get maxCount(): number {
		return this.getPropertyValue("maxCount");
	}

	/**
	 * Minimum occurances for a word to be included in the cloud.
	 *
	 * NOTE: this setting is used only when you set whole text using `text`. If
	 * you set `chart.data` or `series.data` directly, it won't have any effect.
	 *
	 * @default 1
	 * @param  value  Minimum occurences
	 */
	public set minValue(value: number) {
		if (this.setPropertyValue("minValue", value)) {
			this.updateData();
		}
	}

	/**
	 * @return  Minimum occurences
	 */
	public get minValue(): number {
		return this.getPropertyValue("minValue");
	}

	/**
	 * An array of words to exclude from the cloud.
	 *
	 * ```TypeScript
	 * series.excludeWords = ["the", "a", "an"];
	 * ```
	 * ```JavaScript
	 * series.excludeWords = ["the", "a", "an"];
	 * ```
	 * ```JSON
	 * {
	 *   // ...
	 *   "series": [{
	 *     // ...
	 *     "excludeWords": ["the", "a", "an"]
	 *   }]
	 * }
	 * ```
	 *
	 * NOTE: this setting is used only when you set whole text using `text`. If
	 * you set `chart.data` or `series.data` directly, it won't have any effect.
	 *
	 * @param  value  Words to exclude from the cloud
	 */
	public set excludeWords(value: string[]) {
		if (this.setPropertyValue("excludeWords", value)) {
			this.updateData();
		}
	}

	/**
	 * @return Words to exclude from the cloud
	 */
	public get excludeWords(): string[] {
		return this.getPropertyValue("excludeWords");
	}

	/**
	 * Font size for the biggest words.
	 *
	 * This can be set either as a numeric pixel size, or as a relative
	 * as `Percent`.
	 *
	 * When setting as percent it will use series' height or width (the one which is smaller) as a basis for
	 * calculating the font size.
	 *
	 * NOTE: this setting might be automatically adjusted if all words do not fit
	 * in the available space.
	 *
	 * @default 20%
	 * @param  value  Font size
	 */
	public set maxFontSize(value: number | Percent) {
		this.setPropertyValue("maxFontSize", value, true);
	}

	/**
	 * @return {number} Font size
	 */
	public get maxFontSize(): number | Percent {
		return this.getPropertyValue("maxFontSize");
	}

	/**
	 * Font size for the smallest words.
	 *
	 * This can be set either as a numeric pixel size, or as a relative
	 * as `Percent`.
	 *
	 * When setting as percent it will use series' height or width (the one which is smaller) as a basis for
	 * calculating the font size.
	 *
	 * @default 2%
	 * @param  value  Font size
	 */
	public set minFontSize(value: number | Percent) {
		this.setPropertyValue("minFontSize", value, true);
	}

	/**
	 * @return Font size
	 */
	public get minFontSize(): number | Percent {
		return this.getPropertyValue("minFontSize");
	}

	/**
	 * Randomness of word placement.
	 *
	 * Available values are from 0 (no randomization) to 1 (completely random).
	 *
	 * The smaller the value the bigger the chance that biggest words will end up
	 * closer to the center.
	 *
	 * @default 0.2
	 * @param value Randomness
	 */
	public set randomness(value: number) {
		this.setPropertyValue("randomness", value, true);
	}

	/**
	 * @return Randomness
	 */
	public get randomness(): number {
		return this.getPropertyValue("randomness");
	}

	/**
	 * Step by which label is moved if its space is already occupied.
	 *
	 * The smaller the number, the more packed labels will be.
	 *
	 * NOTE: smaller numbers make for more packed clouds, but will consume
	 * considerably more CPU power. Use with caution with bigger clouds.
	 *
	 * @default 15
	 * @param  value Step
	 */
	public set step(value: number) {
		this.setPropertyValue("step", value, true);
	}

	/**
	 * @return Step
	 */
	public get step(): number {
		return this.getPropertyValue("step");
	}

	/**
	 * Accuracy setting when checking for overlapping of words.
	 *
	 * The bigger the number, the bigger chance of overlapping, but it's also
	 * better for performance.
	 *
	 * Use smaller numbers if you are using a thin font.
	 *
	 * @default 5
	 * @param  value  Accuracy
	 */
	public set accuracy(value: number) {
		this.setPropertyValue("accuracy", value, true);
	}

	/**
	 * @return Accuracy
	 */
	public get accuracy(): number {
		return this.getPropertyValue("accuracy");
	}


	/**
	 * Minimum number of characters for a word to be included in the cloud.
	 *
	 * NOTE: this setting is used only when you set whole text using `text`. If
	 * you set `chart.data` or `series.data` directly, it won't have any effect.
	 *
	 * @default 1
	 * @param {number} value Minimum word length
	 */
	public set minWordLength(value: number) {
		if (this.setPropertyValue("minWordLength", value)) {
			this.updateData();
		}
	}

	/**
	 * @return Minimum word length
	 */
	public get minWordLength(): number {
		return this.getPropertyValue("minWordLength");
	}

	/**
	 * Rotation threshold.
	 *
	 * Big words don't look good good when rotated, hence this setting.
	 *
	 * It works like this: if word's relative height is bigger
	 * than `rotationThreshold`, the word will never be rotated.
	 *
	 * Available values are from 0 (none of the words will be rotated) to 1 (all
	 * words can be rotated).
	 *
	 * @default 0.7
	 * @param  value  Threshold
	 */
	public set rotationThreshold(value: number) {
		this.setPropertyValue("rotationThreshold", value, true);
	}

	/**
	 * @return Threshold
	 */
	public get rotationThreshold(): number {
		return this.getPropertyValue("rotationThreshold");
	}

	/**
	 * An array of available word rotation angles.
	 *
	 * The only supported values are: 0 (horizontal), and 90 (vertical).
	 *
	 * @default [0, 0, 90]
	 * @param  value  Angles
	 */
	public set angles(value: number[]) {
		this.setPropertyValue("angles", value, true);
	}

	/**
	 * @return Angles
	 */
	public get angles(): number[] {
		return this.getPropertyValue("angles");
	}

	/**
	 * @ignore
	 * Not finished yet
	 */
	public get maskSprite(): Sprite {
		return this._maskSprite;
	}


	/**
	 * Copies all properties from another instance of [[WordCloudSeries]].
	 *
	 * @param source  Source series
	 */
	public copyFrom(source: this): void {
		super.copyFrom(source);
		this.labels.template.copyFrom(source.labels.template);
	}

	/**
	 * Extracts words and number of their appearances from a text.
	 *
	 * @ignore
	 * @param  input  Source text
	 */
	public getWords(input: string): { word: string, value: number }[] {
		if (input) {
			this.dataFields.word = "word";
			this.dataFields.value = "value";

			const reg = new RegExp("[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376-\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0523\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0621-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06E5-\u06E6\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4-\u07F5\u07FA\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0972\u097B-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D28\u0D2A-\u0D39\u0D3D\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E46\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDD\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8B\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10D0-\u10FA\u10FC\u1100-\u1159\u115F-\u11A2\u11A8-\u11F9\u1200-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u1676\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F0\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19A9\u19C1-\u19C7\u1A00-\u1A16\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u2094\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2C6F\u2C71-\u2C7D\u2C80-\u2CE4\u2D00-\u2D25\u2D30-\u2D65\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31B7\u31F0-\u31FF\u3400\u4DB5\u4E00\u9FC3\uA000-\uA48C\uA500-\uA60C\uA610-\uA61F\uA62A-\uA62B\uA640-\uA65F\uA662-\uA66E\uA67F-\uA697\uA717-\uA71F\uA722-\uA788\uA78B-\uA78C\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA90A-\uA925\uA930-\uA946\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAC00\uD7A3\uF900-\uFA2D\uFA30-\uFA6A\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9@+]+", "ig");
			let res = input.match(reg);
			if (!res) {
				return [];
			}

			let words: { word: string, value: number }[] = [];
			let word;
			while (word = res.pop()) {
				let item;
				for (let i = 0; i < words.length; i++) {
					if (words[i].word.toLowerCase() == word.toLowerCase()) {
						item = words[i];
						break;
					}
				}
				if (item) {
					item.value++;
					if (!this.isCapitalized(word)) {
						item.word = word;
					}
				}
				else {
					words.push({
						word: word,
						value: 1
					})
				}
			}

			let excludeWords = this.excludeWords;
			if (this.minValue > 1 || this.minWordLength > 1 || (excludeWords && excludeWords.length > 0)) {
				for (let i = words.length - 1; i >= 0; i--) {
					let w = words[i];
					if (w.value < this.minValue) {
						words.splice(i, 1);
					}
					if (w.word.length < this.minWordLength) {
						words.splice(i, 1);
					}
					if (excludeWords.indexOf(w.word) !== -1) {
						words.splice(i, 1);
					}
				}
			}

			words.sort(function(a, b) {
				if (a.value == b.value) {
					return 0;
				}
				else if (a.value > b.value) {
					return -1;
				}
				else {
					return 1;
				}
			});


			if (words.length > this.maxCount) {
				words = words.slice(0, this.maxCount);
			}

			return words;
		}
	}

	/**
	 * Checks if word is capitalized (starts with an uppercase) or not.
	 *
	 * @param   word  Word
	 * @return        Capitalized?
	 */
	public isCapitalized(word: string): boolean {
		let lword = word.toLowerCase();
		return word[0] != lword[0]
			&& word.substr(1) == lword.substr(1)
			&& word != lword;
	}
}

/**
 * Register class in system, so that it can be instantiated using its name from
 * anywhere.
 *
 * @ignore
 */
registry.registeredClasses["WordCloudSeries"] = WordCloudSeries;
registry.registeredClasses["WordCloudSeriesDataItem"] = WordCloudSeriesDataItem;
