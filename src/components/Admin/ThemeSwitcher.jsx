import { Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";

const ThemeSwitcher = ({ game, setGame, send }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const availableThemes = {
    weird: {
      bgcolor: "white",
      fgcolor: "text-black",
      title: "Weird",
    },
    harvey: {
      bgcolor: "white",
      fgcolor: "text-black",
      title: "Steve Harvey",
    },
    default: {
      bgcolor: "white",
      fgcolor: "text-black",
      title: "default",
    },
  };

  const handleThemeChange = (newTheme) => {
    try {
      setTheme(newTheme);

      // Create deep copy of game state
      const updatedGame = JSON.parse(JSON.stringify(game));
      updatedGame.settings.theme = newTheme;

      // Update local state
      setGame(updatedGame);

      // Send update to server
      send({
        action: "data",
        data: updatedGame,
      });
    } catch (error) {
      console.error("Error updating theme:", error);
      // Revert theme on error
      setTheme(game.settings.theme);
    }
  };

  return (
    <div className="flex flex-row items-center space-x-5">
      <Palette color="gray" />
      <select
        id="themeSwitcherInput"
        className="w-full rounded-lg bg-secondary-300 p-2 capitalize text-foreground sm:w-fit"
        value={theme || "default"}
        onChange={(e) => handleThemeChange(e.target.value)}
        aria-label={t("Select theme")}
      >
        {Object.keys(availableThemes).map((key) => (
          <option
            value={key}
            key={`theme-${key}`}
            style={{
              backgroundColor: availableThemes[key].bgcolor,
            }}
            className={`${availableThemes[key].fgcolor} capitalize`}
          >
            {availableThemes[key].title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeSwitcher;
