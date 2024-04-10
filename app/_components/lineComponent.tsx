
interface LineProps {
  duration: number;
  startHTML: JSX.Element;
  endHTML: JSX.Element;
}

const LineComponent: React.FC<LineProps> = ({ duration, startHTML, endHTML }) => {
  const progressPercentage = (duration * 100) / duration;

  return (
    <div className="flex items-center gap-2">
      {startHTML}
      <div className="relative flex-grow">
        <div className="absolute top-0 left-0 h-5 w-full bg-gradient-to-r from-hsl(0, 100%, 30%) to-transparent" style={{ width: `${progressPercentage}%` }} />
        <div className="absolute top-0 left-0 h-5 w-full bg-gradient-to-r from-hsl(0, 100%, 45%) to-transparent" />
        <div className="absolute top-0 left-0 h-5 w-full bg-gradient-to-r from-hsl(0, 50%, 50%) to-transparent" />
      </div>
      {endHTML}
    </div>
  );
};

export default LineComponent;
