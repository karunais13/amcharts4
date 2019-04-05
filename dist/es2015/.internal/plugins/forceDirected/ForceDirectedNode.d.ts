/**
 * Module that defines everything related to building ForceDirectedNodes.
 *
 * It is a container which has ForceDirectedNode element which is a RoundedRectangle.
 */
/**
 * ============================================================================
 * IMPORTS
 * ============================================================================
 * @hidden
 */
import { Container, IContainerProperties, IContainerAdapters, IContainerEvents } from "../../core/Container";
import { Circle } from "../../core/elements/Circle";
import { Label } from "../../core/elements/Label";
import { ForceDirectedSeriesDataItem } from "./ForceDirectedSeries";
/**
 * ============================================================================
 * REQUISITES
 * ============================================================================
 * @hidden
 */
/**
 * Defines properties for [[ForceDirectedNode]].
 */
export interface IForceDirectedNodeProperties extends IContainerProperties {
}
/**
 * Defines events for [[ForceDirectedNode]].
 */
export interface IForceDirectedNodeEvents extends IContainerEvents {
}
/**
 * Defines adapters for [[ForceDirectedNode]].
 *
 * @see {@link Adapter}
 */
export interface IForceDirectedNodeAdapters extends IContainerAdapters, IForceDirectedNodeProperties {
}
/**
 * ============================================================================
 * MAIN CLASS
 * ============================================================================
 * @hidden
 */
/**
 * Class used to creates [[ForceDirectedNode]] elements (circles).
 *
 * @see {@link IForceDirectedNodeEvents} for a list of available events
 * @see {@link IForceDirectedNodeAdapters} for a list of available Adapters
 * @since 4.3.8
 * @important
 */
export declare class ForceDirectedNode extends Container {
    /**
     * Defines available properties.
     */
    _properties: IForceDirectedNodeProperties;
    /**
     * Defines available adapters.
     */
    _adapter: IForceDirectedNodeAdapters;
    /**
     * Defines available events.
     */
    _events: IForceDirectedNodeEvents;
    /**
     * A node's [[Circle]] element.
     */
    circle: Circle;
    /**
     * A [[Circle]] element for node's outline. This outline is used on nodes
     * that have children.
     */
    outerCircle: Circle;
    /**
     * Related data item.
     */
    _dataItem: ForceDirectedSeriesDataItem;
    /**
     * Node's [[Label]] element.
     */
    label: Label;
    /**
     * Constructor
     */
    constructor();
    /**
     * @ignore
     */
    protected updateLabelSize(): void;
    /**
     * Copies all parameters from another [[ForceDirectedNode]].
     *
     * @param source Source ForceDirectedNode
     */
    copyFrom(source: this): void;
    /**
     * Sets node as "active" (expanded).
     *
     * @ignore
     * @param  value  Active or not?
     */
    setActive(value: boolean): void;
    /**
     * @ignore
     * @todo description
     */
    protected updateSimulation(): void;
}
