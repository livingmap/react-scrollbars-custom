declare var global: {
  document?: Document;
};
let doc: Document | null = global.document || null;

/**
 * @description Return element's height without padding
 *
 * ts-ignore here is okay here, because it brigs around 40% of performance
 */
export const getInnerHeight = (el: HTMLDivElement): number => {
  const styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return Math.max(
      // @ts-ignore
      (parseFloat(styles.height) || 0) -
        // @ts-ignore
        (parseFloat(styles.paddingTop) || 0) -
        // @ts-ignore
        (parseFloat(styles.paddingBottom) || 0),
      0
    );
  }

  // @ts-ignore
  return parseFloat(styles.height) || 0;
};

/**
 * @description Return element's width without padding
 *
 * ts-ignore here is okay here, because it brigs around 40% of performance
 */
export const getInnerWidth = (el: HTMLDivElement): number => {
  const styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return Math.max(
      // @ts-ignore
      (parseFloat(styles.width) || 0) -
        // @ts-ignore
        (parseFloat(styles.paddingLeft) || 0) -
        // @ts-ignore
        (parseFloat(styles.paddingRight) || 0),
      0
    );
  }

  // @ts-ignore
  return parseFloat(styles.width) || 0;
};

/**
 * @description Return element's dimensions without padding
 *
 * ts-ignore here is okay here, because it brigs around 40% of performance
 */
export const getInnerDimensions = (el: HTMLDivElement): { width: number; height: number } => {
  let styles = getComputedStyle(el);

  if (styles.boxSizing === "border-box") {
    return {
      height: Math.max(
        // @ts-ignore
        (parseFloat(styles.height) || 0) -
          // @ts-ignore
          (parseFloat(styles.paddingTop) || 0) -
          // @ts-ignore
          (parseFloat(styles.paddingBottom) || 0),
        0
      ),
      width: Math.max(
        // @ts-ignore
        (parseFloat(styles.width) || 0) -
          // @ts-ignore
          (parseFloat(styles.paddingLeft) || 0) -
          // @ts-ignore
          (parseFloat(styles.paddingRight) || 0),
        0
      )
    };
  }
  return {
    // @ts-ignore
    height: parseFloat(styles.height) || 0,
    // @ts-ignore
    width: parseFloat(styles.width) || 0
  };
};

/**
 * @description Return unique UUID v4
 */
export const uuid = () => {
  let uuid = "";

  for (let i = 0; i < 32; i++) {
    if (i === 8 || i === 20) {
      uuid += "-" + ((Math.random() * 16) | 0).toString(16);
    } else if (i === 12) {
      uuid += "-4";
    } else if (i === 16) {
      uuid += "-" + ((Math.random() * 16) | (0 & 3) | 8).toString(16);
    } else {
      uuid += ((Math.random() * 16) | 0).toString(16);
    }
  }

  return uuid;
};

/**
 * @description Calculate thumb size for given viewport and track parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} minimalSize - Minimal thumb's size
 * @param {number} maximalSize - Maximal thumb's size
 */
export function calcThumbSize(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  minimalSize?: number,
  maximalSize?: number
): number {
  if (viewportSize >= contentSize) {
    return 0;
  }

  let thumbSize = (viewportSize / contentSize) * trackSize;

  if (typeof maximalSize === "number") {
    thumbSize = Math.min(maximalSize, thumbSize);
  }
  if (typeof minimalSize === "number") {
    thumbSize = Math.max(minimalSize, thumbSize);
  }

  return thumbSize;
}

/**
 * @description Calculate thumb offset for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} scroll - Scroll value to represent
 */
export function calcThumbOffset(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  scroll: number
): number {
  if (!scroll || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return ((trackSize - thumbSize) * scroll) / (contentSize - viewportSize);
}

/**
 * @description Calculate scroll for given viewport, track and thumb parameters
 *
 * @param {number} contentSize - Scrollable content size
 * @param {number} viewportSize - Viewport size
 * @param {number} trackSize - Track size thumb can move
 * @param {number} thumbSize - Thumb size
 * @param {number} thumbOffset - Thumb's offset representing the scroll
 */
export function calcScrollForThumbOffset(
  contentSize: number,
  viewportSize: number,
  trackSize: number,
  thumbSize: number,
  thumbOffset: number
): number {
  if (!thumbOffset || !thumbSize || viewportSize >= contentSize) {
    return 0;
  }

  return (thumbOffset * (contentSize - viewportSize)) / (trackSize - thumbSize);
}

let scrollbarWidth: number | null = null;

/**
 * @description Returns scrollbar width specific for current environment
 */
export function getScrollbarWidth(force = false) {
  if (!force && scrollbarWidth !== null) {
    return scrollbarWidth;
  }

  if (!doc) {
    return (scrollbarWidth = 0);
  }

  let el = doc.createElement("div");
  el.setAttribute("style", "display:block;position:absolute;width:100px;height:100px;top:-9999px;overflow:scroll;");

  doc.body.appendChild(el);
  scrollbarWidth = Math.ceil(el.offsetWidth - el.clientWidth);
  doc.body.removeChild(el);

  return scrollbarWidth;
}

/**
 * @description Set the cached width to given value.<br/>
 *              <i>null</i> will force to recalculate value on next get.
 */
export const _dbgSetScrollbarWidth = (v: number | null): number | null => {
  if (typeof v === "number" || v === null) {
    return (scrollbarWidth = v);
  }

  throw new TypeError("override value expected to be a number or null, got " + typeof v);
};

/**
 * @description Set the document node to calculate the scrollbar width.<br/>
 *              <i>null</i> will force getter to return 0 (it'll imitate SSR).
 */
export const _dbgSetDocument = (v: Document | null): Document | null => {
  if (v === null || v instanceof HTMLDocument) {
    return (doc = v);
  }

  throw new TypeError("override value expected to be an instance of HTMLDocument or null, got " + typeof v);
};

/**
 * @description Return current document node
 */
export const _dbgGetDocument = (): Document | null => doc;

let isReverseRTLScrollNeeded: boolean | null = null;

/**
 * @description Detect need of horizontal scroll reverse while RTL
 */
export const shouldReverseRTLScroll = (force: boolean = false): boolean => {
  if (!force && isReverseRTLScrollNeeded !== null) {
    return isReverseRTLScrollNeeded;
  }

  if (!doc) {
    return (isReverseRTLScrollNeeded = false);
  }

  let el = doc.createElement("div");
  let child = doc.createElement("div");
  el.setAttribute(
    "style",
    "display:block;position:absolute;width:100px;height:100px;top:-9999px;overflow:scroll;direction:rtl;"
  );
  child.setAttribute("style", "display:block;position:relative;width:1000px;height:1000px;direction:rtl;");
  el.appendChild(child);

  doc.body.appendChild(el);
  el.scrollLeft;
  el.scrollLeft = 45;
  isReverseRTLScrollNeeded = el.scrollLeft === 0;
  doc.body.removeChild(el);

  return isReverseRTLScrollNeeded;
};

/**
 * @description Set the cached value to given value.<br/>
 *              <i>null</i> will force to recalculate value on next get.
 */
export const _dbgSetIsReverseRTLScrollNeeded = (v: boolean | null): boolean | null => {
  if (typeof v === "boolean" || v === null) {
    return (isReverseRTLScrollNeeded = v);
  }

  throw new TypeError("override value expected to be a boolean or null, got " + typeof v);
};
