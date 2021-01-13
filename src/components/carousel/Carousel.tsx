import React, {
    FC,
    ReactNodeArray,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
  } from 'react';
  import './Carousel.css';
  interface Props {
    children: ReactNodeArray;
  }
  
  const Carousel: FC<Props> = ({ children }) => {
    const [isAnimationStarted, setIsAnimationStarted] = useState(false);
    const [animationDiresction, setAnimationDirection] = useState('');
    const [isDragActive, setIsDragActive] = useState(false);
    const [mouseSwipeDirection, setMouseSwipeDirection] = useState([0, 0]);
    const [touchSwipeDirection, setTouchSwipeDirection] = useState([0, 0]);
    const [currIndex, setCurrIndex] = useState(0);
  
    const prevIndex = currIndex === 0 ? children.length - 1 : currIndex - 1;
    const nextIndex = currIndex >= children.length - 1 ? 0 : currIndex + 1;
    const slider = [
      children[prevIndex],
      children[currIndex],
      children[nextIndex],
    ];
  
    const pixelMovementArr = useRef<number[]>([]);
    const sliderEl = useRef<HTMLDivElement>(null);
    const touchMovementPixelArr = useRef<number[]>([]);
  
    const mouseSwipeRight = mouseSwipeDirection[0] < mouseSwipeDirection[1],
      touchSwipeRight = touchSwipeDirection[0] < touchSwipeDirection[1],
      mouseSwipeLeft = mouseSwipeDirection[0] > mouseSwipeDirection[1],
      touchSwipeLeft = touchSwipeDirection[0] > touchSwipeDirection[1];
  
    const moveForward = () => {
      setCurrIndex(currIndex + 1);
      if (currIndex >= children.length - 1) {
        setCurrIndex(0);
      }
    };
    const moveBackward = () => {
      setCurrIndex(currIndex - 1);
      if (currIndex <= 0) {
        setCurrIndex(children.length - 1);
      }
    };
  
    const mouseDragHandler = (event: React.MouseEvent) => {
      if (sliderEl.current) {
        pixelMovementArr.current.push(event.movementX);
        const pixelMovementSum = pixelMovementArr.current.reduce(
          (arr, acc) => arr + acc,
        );
        sliderEl.current.style.transform = `translateX(${pixelMovementSum}px)`;
      }
    };
  
    const touchDragHandler = (e: React.TouchEvent) => {
      if (sliderEl.current) {
        const pixelMovementSum =
          (touchMovementPixelArr.current[0] - e.touches[0].clientX) * -1;
        sliderEl.current.style.transform = `translateX(${pixelMovementSum}px)`;
      }
    };
    const mouseDownHandler = (e: React.MouseEvent) => {
      if (!isAnimationStarted) {
        setMouseSwipeDirection([e.clientX]);
        setIsDragActive(true);
      }
    };
  
    const mouseUpHandler = (e: React.MouseEvent) => {
      if (!isAnimationStarted) {
        setMouseSwipeDirection([...mouseSwipeDirection, e.clientX]);
        setIsDragActive(false);
        if (pixelMovementArr.current.length) {
          setIsAnimationStarted(true);
          pixelMovementArr.current = [];
        }
      }
    };
  
    const mouseOutHandler = (e: React.MouseEvent) => {
      if (isDragActive) {
        setMouseSwipeDirection([...mouseSwipeDirection, e.clientX]);
        setIsAnimationStarted(true);
        setIsDragActive(false);
        pixelMovementArr.current = [];
      }
    };
  
    const mouseMoveHandler = (e: React.MouseEvent) => {
      if (isDragActive) {
        mouseDragHandler(e);
      }
    };
  
    const touchMoveHandler = (e: React.TouchEvent) => {
      touchDragHandler(e);
      if (!touchMovementPixelArr.current.length) {
        touchMovementPixelArr.current.push(e.touches[0].clientX);
      }
    };
  
    const touchStartHandler = (e: React.TouchEvent) => {
      if (!isAnimationStarted) {
        setTouchSwipeDirection([e.changedTouches[0].clientX]);
        setIsDragActive(true);
      }
    };
  
    const touchEndHandler = (e: React.TouchEvent) => {
      if (!isAnimationStarted) {
        setTouchSwipeDirection([
          ...touchSwipeDirection,
          e.changedTouches[0].clientX,
        ]);
        setIsDragActive(false);
        if (touchMovementPixelArr.current.length) {
          setIsAnimationStarted(true);
          pixelMovementArr.current = [];
        }
        touchMovementPixelArr.current = [];
      }
    };
  
    useLayoutEffect(() => {
      if (!isAnimationStarted) {
        if (sliderEl.current) {
          sliderEl.current.style.transform = 'translateX(0px)';
        }
        if (mouseSwipeRight || touchSwipeRight) {
          moveBackward();
        } else if (mouseSwipeLeft || touchSwipeLeft) {
          moveForward();
        }
        setMouseSwipeDirection([0, 0]);
        setTouchSwipeDirection([0, 0]);
      }
    }, [isAnimationStarted]);
  
    useEffect(() => {
      if (mouseSwipeRight || touchSwipeRight) {
        setAnimationDirection('animateRight');
      } else if (mouseSwipeLeft || touchSwipeLeft) {
        setAnimationDirection('animateLeft');
      }
    }, [mouseSwipeDirection, touchSwipeDirection]);
  
    return (
      <div className="sliderWrapper">
        <div
          onAnimationEnd={() => setIsAnimationStarted(false)}
          onMouseDown={(e) => mouseDownHandler(e)}
          onMouseUp={(e) => mouseUpHandler(e)}
          onMouseOut={(e) => mouseOutHandler(e)}
          onMouseMove={(e) => mouseMoveHandler(e)}
          onTouchMove={(e) => touchMoveHandler(e)}
          onTouchStart={(e) => touchStartHandler(e)}
          onTouchEnd={(e) => touchEndHandler(e)}
          className={
            isAnimationStarted ? `slider ${animationDiresction}` : 'slider'
          }
          ref={sliderEl}
        >
          {slider.map((item, i) => {
            return (
              <div className={'sliderItem'} key={`${i}`}>
                {item}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  export default Carousel;
  