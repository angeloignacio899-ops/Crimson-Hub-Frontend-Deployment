export default function UpcomingEvent({ date, month, title, time }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <div className="bg-[#d64553]/10 text-[#d64553] w-12 h-12 flex flex-col items-center justify-center rounded-lg font-bold">
          <span className="text-lg">{date}</span>
          <span className="text-xs uppercase">{month}</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-500">{time}</p>
        </div>
      </div>
    </div>
  );
}
