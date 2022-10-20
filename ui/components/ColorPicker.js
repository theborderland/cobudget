import { CheckIcon } from "components/Icons";
import { colors } from "utils/colors";
import { FormattedMessage, useIntl } from "react-intl";

export default ({ setColor, color: currentColor }) => {
  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        <FormattedMessage defaultMessage="Color" />
      </label>
      <div className="flex flex-wrap">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setColor(color)}
            className={`h-8 w-8 m-1 bg-${color} text-white rounded-full focus:outline-none flex items-center justify-center`}
          >
            {currentColor === color && <CheckIcon />}
          </button>
        ))}
      </div>
    </div>
  );
};
