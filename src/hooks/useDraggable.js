import { useRef, useState } from "react";

const useDraggable = (direction) => {
  const [isDraggable, setIsDraggable] = useState(false);
  const [position, setPosition] = useState({});
  // 拖动的界限
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 });
  // 拖动组件的ref
  const draggleRef = useRef(null);

  // 开始拖动
  const onStart = (event, uiData) => {
    setPosition({ clientX: event.clientX, clientY: event.clientY });
    onMobileRange(draggleRef, uiData);
  };

  // 停止拖动
  const onStop = (e) => {
    if (position.clientX === e.clientX && position.clientY === e.clientY) {
      setIsDraggable(false);
    } else {
      setIsDraggable(true);
    }
  };

  // 设置拖动的界限
  const onMobileRange = (draggleRef, uiData) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const targetRect = draggleRef.current?.getBoundingClientRect();
    if (!targetRect) {
      return;
    }
    switch (direction) {
      case "upDown":
        //上下拖动
        setBounds({
          left: 0,
          right: 0,
          top: -targetRect.top + uiData.y,
          bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
        break;
      case "leftRight":
        //左右拖动
        setBounds({
          left: -targetRect.left + uiData.x,
          right: clientWidth - (targetRect.right - uiData.x),
          top: 0,
          bottom: 0,
        });
        break;
      default:
        //自由拖动
        setBounds({
          left: -targetRect.left + uiData.x,
          right: clientWidth - (targetRect.right - uiData.x),
          top: -targetRect.top + uiData.y,
          bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
        break;
    }
  };

  return { draggleRef, bounds, isDraggable, onStart, onStop };
};
export default useDraggable;
