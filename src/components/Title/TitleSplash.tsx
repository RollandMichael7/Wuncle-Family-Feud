import { Game, PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface TitleSplashProps {
  game: Game;
}

const TitleSplash: React.FC<TitleSplashProps> = ({ game }) => {
  return (
    <div>
      <video loop autoPlay muted src="splash-bg.mp4"></video>
    </div>
  );
};

export default TitleSplash;
