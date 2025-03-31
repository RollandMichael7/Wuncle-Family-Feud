import { PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface LabeledPrismProps {
  isVisible: boolean;
  currentSide: PrismSide;
  width: number;
  height: number;
  depth: number;
  frontLabel?: any;
  bottomLabel?: any;
  rightLabel?: any;
  backLabel?: any;
  leftLabel?: any;
  topLabel?: any;
  margins?: string;
  faceClassName?: string;
  sceneClassName?: string;
}

const LabeledPrism: React.FC<LabeledPrismProps> = ({
  currentSide,
  isVisible = true,
  frontLabel = "",
  bottomLabel = "",
  rightLabel = "",
  backLabel = "",
  leftLabel = "",
  topLabel = "",
  faceClassName = "",
  sceneClassName = "",
  width,
  height,
  depth,
  margins,
}) => {
  const showClass = `show-${PrismSide[currentSide].toLowerCase()}`;

  const frontBackTranslate = depth / 2;
  const frontBackStyle = (isFront: boolean) => {
    return {
      width: width,
      height: height,
      lineHeight: `${height}px`,
      transform: isFront
        ? `translateZ(${frontBackTranslate}px)`
        : `translateZ(-${frontBackTranslate}px) rotateX(180deg)`,
    };
  };

  const leftTranslate = depth / 2;
  const rightTranslate = width - depth / 2;
  const leftRightStyle = (isLeft: boolean) => {
    return {
      width: depth,
      height: height,
      lineHeight: `${height}px`,
      transform: `rotateY(${isLeft ? "-90deg" : "90deg"}) translateZ(${isLeft ? leftTranslate : rightTranslate}px)`,
    };
  };

  const topTranslate = depth / 2;
  const bottomTranslate = height - depth / 2;
  const topBottomStyles = (isTop: boolean) => {
    return {
      width: width,
      height: depth,
      lineHeight: `${depth}px`,
      transform: `rotateX(${isTop ? "90deg" : "-90deg"}) translateZ(${isTop ? topTranslate : bottomTranslate}px)`,
    };
  };

  const sceneStyles = {
    width: width,
    height: height,
    margin: margins || ".25rem",
    overflow: "hidden",
  };

  const prismStyles = {
    width: width,
    height: height,
  };

  return (
    <div style={sceneStyles} className={`prism-scene ${sceneClassName} ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div style={prismStyles} className={`prism ${showClass} ${sceneClassName}`}>
        <div className={`prism__face prism__face--front ${faceClassName}`} style={frontBackStyle(true)}>
          {frontLabel}
        </div>
        <div className={`prism__face prism__face--back ${faceClassName}`} style={frontBackStyle(false)}>
          {backLabel}
        </div>
        <div className={`prism__face prism__face--right ${faceClassName}`} style={leftRightStyle(false)}>
          {rightLabel}
        </div>
        <div className={`prism__face prism__face--left ${faceClassName}`} style={leftRightStyle(true)}>
          {leftLabel}
        </div>
        <div className={`prism__face prism__face--top ${faceClassName}`} style={topBottomStyles(true)}>
          {topLabel}
        </div>
        <div className={`prism__face prism__face--bottom ${faceClassName}`} style={topBottomStyles(false)}>
          {bottomLabel}
        </div>
      </div>
    </div>
  );
};

export default LabeledPrism;
