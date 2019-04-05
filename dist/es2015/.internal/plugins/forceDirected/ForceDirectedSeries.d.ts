/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Series, SeriesDataItem, ISeriesDataFields, ISeriesProperties, ISeriesAdapters, ISeriesEvents } from "../../charts/series/Series";
import { ForceDirectedTree, ForceDirectedTreeDataItem } from "./ForceDirectedTree";
import { ListTemplate, List } from "../../core/utils/List";
import { ForceDirectedNode } from "./ForceDirectedNode";
import { ForceDirectedLink } from "./ForceDirectedLink";
import { ColorSet } from "../../core/utils/ColorSet";
import * as d3force from "d3-force";
import * as $type from "../../core/utils/Type";
import { Color } from "../../core/utils/Color";
import { OrderedListTemplate } from "../../core/utils/SortedList";
import { Container } from "../../core/Container";
import { LegendDataItem } from "../../charts/Legend";
import { Animation } from "../../core/utils/Animation";
/**
 * ============================================================================
 * DATA ITEM
 * ============================================================================
 * @hidden
 */
/**
 * Defines a [[DataItem]] for [[ForceDirectedSeries]].
 *
 * @see {@link DataItem}
 * @since 4.3.8
 */
export declare class ForceDirectedSeriesDataItem extends SeriesDataItem {
    /**
     * Defines a type of [[Component]] this data item is used for.
     */
    _component: ForceDirectedSeries;
    /**
     * A reference to a component of a data item.
     */
    component: ForceDirectedSeries;
    /**
     * A type of node used for this series.
     */
    _node: ForceDirectedNode;
    /**
     * A list of [[ForceDirectedLink]] elements of links  to node's children.
     *
     * This list does not include a link to node's parent, which is available
     * through `parentLink`.
     */
    childLinks: List<ForceDirectedLink>;
    /**
     * A [[ForceDirectedLink]] to node's parent.
     */
    parentLink: ForceDirectedLink;
    /**
     * A Legend's data item.
     */
    protected _legendDataItem: LegendDataItem;
    /**
     * Have all children already been initialized?
     */
    childrenInited: boolean;
    /**
     * Constructor
     */
    constructor();
    /**
     * Shows the Data Item and related visual elements.
     *
     * @param duration  Animation duration (ms)
     * @param delay     Delay animation (ms)
     * @param fields    A list of fields to set values of
     */
    show(duration?: number, delay?: number, fields?: string[]): $type.Optional<Animation>;
    /**
     * @ignore
     */
    dispatchVisibility(visible: boolean): void;
    /**
     * Hides the Data Item and related visual elements.
     *
     * @param duration  Animation duration (ms)
     * @param delay     Delay animation (ms)
     * @param toValue   A value to set to `fields` when hiding
     * @param fields    A list of data fields to set value to `toValue`
     */
    hide(duration?: number, delay?: number, toValue?: number, fields?: string[]): $type.Optional<Animation>;
    /**
     * @return Value
     */
    /**
     * Numeric value of the item.
     *
     * @param value  Value
     */
    value: number;
    /**
     * An element, related to this data item. (node)
     *
     * @readonly
     * @return node element
     */
    readonly node: ForceDirectedNode;
    /**
     * Depth level in the series hierarchy.
     *
     * The top-level item will have level set at 0. Its children will have
     * level 1, and so on.
     *
     * @readonly
     * @return Level
     */
    readonly level: number;
    /**
     * @return Color
     */
    /**
     * Item's color.
     *
     * If not set, will use parent's color, or, if that is not set either,
     * automatically assigned color from chart's color set. (`chart.colors`)
     *
     * @param value  Color
     */
    color: Color;
    /**
     * @return Link list
     */
    /**
     * An array of id's of other nodes outside of the child/parent tree to link
     * with.
     *
     * @param  value  Link list
     */
    linkWith: string[];
    /**
     * @return Hidden in legend?
     */
    /**
     * Should dataItem (node) be hidden in legend?
     *
     * @param value Visible in legend?
     */
    hiddenInLegend: boolean;
    /**
     * @return Collapsed?
     */
    /**
     * Indicates whether node should start off as collapsed.
     *
     * This can be used to specify whether node should start off as collapsed
     * via data.
     *
     * To toggle actual node, use its `isActive` property instead.
     *
     * @param  value  Collapsed?
     */
    collapsed: boolean;
    /**
     * @return Item's children
     */
    /**
     * A list of item's sub-children.
     *
     * @param children  Item's children
     */
    children: OrderedListTemplate<ForceDirectedSeriesDataItem>;
    /**
     * Creates a marker used in the legend for this slice.
     *
     * @ignore Exclude from docs
     * @param marker  Marker container
     */
    createLegendMarker(marker: Container): void;
    /**
     * @return Legend data item
     */
    /**
     * A legend's data item, that corresponds to this data item.
     *
     * @param value  Legend data item
     */
    legendDataItem: LegendDataItem;
}
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines data fields for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesDataFields extends ISeriesDataFields {
    /**
     * Name of the field in data that holds category.
     */
    category?: string;
    /**
     * A name of the field in data that holds item's sub-items.
     */
    children?: string;
    /**
     * A name of the field in data that holds item's name.
     */
    name?: string;
    /**
     * A name of the field tha holds an array of ids that node should link with
     * besides of it's own children or parent.
     */
    linkWith?: string;
    /**
     * A name of the field in data that holds item's color.
     *
     * If not set, a new color will be automatically assigned to each item as
     * defined by theme.
     */
    color?: string;
    /**
     * Name of the field in data that holds boolean flag if item should be
     * hidden in legend.
     */
    hiddenInLegend?: string;
    /**
     * A name of the field that holds boolean flag whether node should start
     * as collapsed. (nodes start as fully expanded by default)
     */
    collapsed?: string;
}
/**
 * Defines properties for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesProperties extends ISeriesProperties {
    /**
     * Smallest possible radius in pixels of the node circle.
     *
     * @default 5
     */
    minRadius?: number;
    /**
     * Biggest possible radius in pixels of the node circle.
     *
     * @default 70
     */
    maxRadius?: number;
    /**
     * A color set to be used for coloring nodes.
     *
     * Each new top level will be assigned a new color from this list.
     */
    colors?: ColorSet;
    /**
     * Number of levels to display initially.
     */
    maxLevels?: number;
    /**
     * A relative strength with which nodes push or attract each other.
     */
    manyBodyStrength?: number;
    /**
     * A relative strength with which nodes are pushed away or attracted to
     * center of the chart.
     */
    centerStrength?: number;
}
/**
 * Defines events for [[ForceDirectedSeries]].
 *
 * @since 4.3.8
 */
export interface IForceDirectedSeriesEvents extends ISeriesEvents {
}
/**
 * Defines adapters for [[ForceDirectedSeries]].
 *
 * @see {@link Adapter}
 * @since 4.3.8
 */
export interface IForceDirectedSeriesAdapters extends ISeriesAdapters, IForceDirectedSeriesProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Defines [[Series]] for a [[ForceDirectedTree]] chart.
 *
 * @see {@link IForceDirectedSeriesEvents} for a list of available Events
 * @see {@link IForceDirectedSeriesAdapters} for a list of available Adapters
 * @see {@link https://www.amcharts.com/docs/v4/chart-types/ForceDirectedTree/} For more information
 * @todo Example
 * @since 4.3.8
 * @important
 */
export declare class ForceDirectedSeries extends Series {
    /**
     * @ignore
     */
    _node: ForceDirectedNode;
    /**
     * @ignore
     */
    protected _nodes: ListTemplate<this["_node"]>;
    /**
     * @ignore
     */
    _link: ForceDirectedLink;
    /**
     * @ignore
     */
    protected _links: ListTemplate<this["_link"]>;
    /**
     * Defines the type of data fields used for the series.
     */
    _dataFields: IForceDirectedSeriesDataFields;
    /**
     * Defines available properties.
     */
    _properties: IForceDirectedSeriesProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IForceDirectedSeriesAdapters;
    /**
     * Defines available events.
     */
    _events: IForceDirectedSeriesEvents;
    /**
     * Defines the type of data item.
     */
    _dataItem: ForceDirectedSeriesDataItem;
    /**
     * A chart series belongs to.
     */
    _chart: ForceDirectedTree;
    /**
     * Parent data item of a series.
     */
    parentDataItem: ForceDirectedTreeDataItem;
    /**
     * A reference to the `d3.Simulation` instance for fine-grained configuration
     * of node gravitational dynamics.
     *
     * @see {@link https://github.com/d3/d3-force#simulation} For more info
     */
    d3forceSimulation: d3force.Simulation<{}, d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>>;
    /**
     * @ignore
     */
    protected _maxValue: number;
    /**
     * @ignore
     */
    protected _forceLinks: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>[];
    /**
     * @ignore
     */
    protected _linkForce: d3force.ForceLink<d3force.SimulationNodeDatum, d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>>;
    /**
     * @ignore
     */
    protected _collisionForce: d3force.ForceCollide<d3force.SimulationNodeDatum>;
    /**
     * Constructor
     */
    constructor();
    /**
     * Returns maximum value from all supplied data items.
     *
     * @ignore
     * @param   dataItems  List of data items
     * @param   max        Default max
     * @return             Max
     */
    protected getMaxValue(dataItems: OrderedListTemplate<ForceDirectedSeriesDataItem>, max: number): number;
    /**
     * Validates (processes) data items.
     *
     * @ignore Exclude from docs
     */
    validateDataItems(): void;
    /**
     * @ignore
     * @todo description
     */
    updateNodeList(): void;
    /**
     * @ignore
     * @todo description
     */
    updateLinksAndNodes(): void;
    /**
     * @ignore
     * @todo description
     */
    protected getDistance(linkDatum: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>): number;
    /**
     * @ignore
     * @todo description
     */
    protected getStrength(linkDatum: d3force.SimulationLinkDatum<d3force.SimulationNodeDatum>): number;
    /**
     * Handler for drag end event.
     *
     * @ignore
     */
    nodeDragEnded(): void;
    /**
     * Handler for drag start event.
     *
     * @ignore
     */
    nodeDragStarted(): void;
    /**
     * Resets positions of whole tree.
     *
     * @ignore
     */
    restartSimulation(): void;
    /**
     * Initializes node.
     *
     * @ignore
     */
    initNode(dataItem: ForceDirectedSeriesDataItem): void;
    /**
     * @ignore
     * @todo description
     */
    protected processLinkWith(dataItem: ForceDirectedSeriesDataItem): void;
    /**
     * Returns a [[ForceDirectedSeriesDataItem]] related to node by specific id.
     *
     * @ignore
     * @param   dataItems  List of data items to search in
     * @param   id         Id to search for
     * @return             Data item
     */
    getDataItemById(dataItems: OrderedListTemplate<ForceDirectedSeriesDataItem>, id: string): ForceDirectedSeriesDataItem;
    /**
     * Returns a new/empty DataItem of the type appropriate for this object.
     *
     * @see {@link DataItem}
     * @return Data Item
     */
    protected createDataItem(): this["_dataItem"];
    /**
     * A list of nodes in series.
     *
     * @return  Node list
     */
    readonly nodes: ListTemplate<this["_node"]>;
    /**
     * A list of links between nodes.
     *
     * @return  Link list
     */
    readonly links: ListTemplate<this["_link"]>;
    /**
     * Creates a new node.
     */
    protected createNode(): this["_node"];
    /**
     * Creates a new link.
     */
    protected createLink(): this["_link"];
    /**
     * @return Minimum radius (px)
     */
    /**
     * Smallest possible radius in pixels of the node circle.
     *
     * @default 5
     * @param  value  Minimum radius (px)
     */
    minRadius: number;
    /**
     * @return Maximum radius (px)
     */
    /**
     * Biggest possible radius in pixels of the node circle.
     *
     * @default 70
     * @param  value  Maximum radius (px)
     */
    maxRadius: number;
    /**
     * @return Color set
     */
    /**
     * A color set to be used for nodes.
     *
     * iIt works like this:
     *
     * The first level with more than one node, assigns different colors to all
     * nodes in this list. Their child nodes inherit the color.
     *
     * For example, if the top level has one node with three children, the top
     * node will get first color, the first child will get second color, etc.
     *
     * If there are two top nodes, the first top node gets first color, the
     * second top node gets the second color. Their subsequent children inherit
     * colors.
     *
     * @param value  Color set
     */
    colors: ColorSet;
    /**
     * @return Number of levels
     */
    /**
     * Number of levels to be displayed initially.
     *
     * @param  value  Number of levels
     */
    maxLevels: number;
    /**
     * @return  Body push/attrack strength
     */
    /**
     * Relative strength each node pushes (or attracts) other nodes (it is
     * multiplied by `node.circle.radius` for big nodes to push stronger).
     *
     * Positive value will make nodes attract each other, while negative will
     * push away each other.
     *
     * Available value range: `-50` to `50`.
     *
     * @default -12
     * @param  value  Body push/attrack strength
     */
    manyBodyStrength: number;
    /**
     * @return  Stregth of attraction to center
     */
    /**
     * Relative strength each child node is pushes (or attracted) to the center
     * of the chart.
     *
     * Positive value will make nodes to be attracted to center, while negative
     * will push them away.
     *
     * Available value range: `-50` to `50`.
     *
     * @default 1.2
     * @param  value  Stregth of attraction to center
     */
    centerStrength: number;
    /**
     * Binds related legend data item's visual settings to this series' visual
     * settings.
     *
     * @ignore Exclude from docs
     * @param marker    Container
     * @param dataItem  Data item
     */
    createLegendMarker(marker: Container, dataItem?: this["_dataItem"]): void;
}
