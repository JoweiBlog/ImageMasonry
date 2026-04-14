import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';

import { useMap } from 'ahooks';
import { ImageViewer } from 'antd-mobile';
import { isNil } from 'lodash';

import { useAnimateFrame } from '@/hooks';

/** Props */
export interface Props {
  /** 图片集合 */
  data: string[];
  /** 行数，默认：1, 不支持动态变更 */
  initialRowCount?: number;
  /** 行高度，默认：100 (px) */
  rowHeight?: number;
  /** 加速度，默认：1.5 */
  acceleration?: number;
  /** 横向间距，默认：0 */
  rowGap?: number;
  /** 竖向间距，默认：0 */
  columnGap?: number;
}

/** Ref */
export type Ref = ReturnType<typeof useAnimateFrame>;

type ChildNodeAnimate = {
  /** 下一帧x偏移值 */
  nextX: number;
  /** 下一帧y偏移值 */
  nextY: number;
};

type ChildBuffer = {
  /** key */
  key: string;
  /** 节点宽度 */
  nodeWidth: number;
};

/**
 * 图片瀑布流
 */
const ImageMasonry = forwardRef<Ref, Props>((props, ref) => {
  const rowCount = props.initialRowCount ?? 1;
  const rowHeight = props.rowHeight ?? 100;
  const acceleration = props.acceleration ?? 0.5;
  const rowGap = props.rowGap ?? 0;
  const columnGap = props.columnGap ?? 0;
  const viewHeight = rowHeight * rowCount;

  const childBuffer = useRef<ChildBuffer[]>([]);
  const rowWidths = useRef<number[]>(new Array(rowCount).fill(0));
  const wrapRef = useRef<HTMLDivElement>(null);
  const childNodeMap = useRef(new Map<string, HTMLImageElement | null>());
  const [nodeAnimateMap, { set, get }] = useMap<string, Partial<ChildNodeAnimate>>([]);

  const animate = useCallback(() => {
    if (props.data.length <= 0) return;

    const wrapWidth = wrapRef.current?.getBoundingClientRect()?.width ?? 0;

    if (wrapWidth > 0) {
      for (const [key, node] of childNodeMap.current) {
        if (node) {
          const nodeWidth = node?.getBoundingClientRect().width ?? 0;

          if (nodeWidth > 0) {
            const outViewerEdge = -1 * nodeWidth;
            let nextX = get(key)?.nextX ?? outViewerEdge;
            const nextY = get(key)?.nextY ?? 0;

            if (nextX > outViewerEdge) {
              nextX -= acceleration;
            } else {
              childBuffer.current.findIndex((b) => b.key === key) < 0 &&
                childBuffer.current.push({ key, nodeWidth });
            }

            set(key, { nextX, nextY });
          }
        }
      }

      while (childBuffer.current.length > 0 && Math.min(...rowWidths.current) < wrapWidth) {
        // 当缓冲区有节点，且内容区宽度小于最小视图区宽度时，依次推入节点；
        const { key, nodeWidth } = childBuffer.current.shift()!;

        const minRowWidthIndex = rowWidths.current.indexOf(Math.min(...rowWidths.current));
        const [nextX, nextY] = [
          rowWidths.current[minRowWidthIndex] + columnGap,
          minRowWidthIndex * (rowHeight + rowGap)
        ];

        rowWidths.current[minRowWidthIndex] += nodeWidth + columnGap;

        set(key, { nextX, nextY });
      }

      rowWidths.current = rowWidths.current.map((rw) => Math.max(0, rw - acceleration));
    }
  }, [acceleration, props.data, set, get, rowGap, rowHeight, columnGap]);

  const { start, stop } = useAnimateFrame(animate, true);

  useImperativeHandle(ref, () => ({ start, stop }));

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: viewHeight + rowGap * (rowCount - 1) }}>
      {props.data.map((img, index) => {
        const key = `${img}_${index}`;
        const nodeAnimate = nodeAnimateMap.get(key);

        return (
          <img
            ref={(n) => {
              n && childNodeMap.current.set(key, n);
            }}
            key={key}
            style={{
              height: rowHeight,
              transform: `translate(${isNil(nodeAnimate?.nextX) ? `-100%` : `${nodeAnimate?.nextX}px`}, ${nodeAnimate?.nextY ?? 0}px)`
            }}
            className="absolute left-0 top-0 inline-block max-w-fit overflow-hidden object-cover"
            src={img}
            alt={img}
            onClick={() => {
              ImageViewer.show({ image: img });
            }}
          />
        );
      })}
    </div>
  );
});

export default ImageMasonry;

import { useCallback, useEffect, useRef } from 'react';

/**
 * 动画帧循环
 *
 * @param fn - 回调，入参帧数
 * @param defaultAutoStart - 是否自动开始，默认不自动开始；不支持动态变更
 */
export default function useAnimateFrame(fn: (timestamp: number) => void, defaultAutoStart = false) {
  const frameId = useRef<number>();
  const prevFrameId = useRef<number>();
  const running = useRef(defaultAutoStart);

  const animate = useCallback(
    (time: number) => {
      if (!prevFrameId.current) {
        prevFrameId.current = time;
      }

      fn(time - prevFrameId.current);
      prevFrameId.current = time;
      frameId.current = requestAnimationFrame(animate);
    },
    [fn]
  );

  const stop = useCallback(() => {
    if (!running.current) return;

    frameId.current && cancelAnimationFrame(frameId.current);
    running.current = false;
  }, []);

  const start = useCallback(() => {
    if (running.current) return;

    prevFrameId.current = undefined;
    frameId.current = requestAnimationFrame(animate);
    running.current = true;
  }, [animate]);

  useEffect(() => {
    defaultAutoStart && start();

    return stop;
  }, [defaultAutoStart, start, stop]);

  return { start, stop };
}
