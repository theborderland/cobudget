const Label = ({ children, className, testid = undefined }) => (
  <div
    data-testid={testid}
    className={`bg-red text-white rounded-full text-xs font-semibold shadow uppercase py-1 px-2 tracking-wide ${className}`}
  >
    {children}
  </div>
);

export default Label;

//absolute right-0 bg-red-500 text-white rounded-full text-sm font-semibold shadow uppercase py-1 px-2 m-6 tracking-wide
