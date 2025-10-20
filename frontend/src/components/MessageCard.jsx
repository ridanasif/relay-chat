const MessageCard = ({ messageItem, isReceiver = false }) => {
  return (
    <p
      className={`${
        isReceiver
          ? "bg-white self-start rounded-tl-md rounded-bl-full rounded-br-full rounded-tr-full"
          : "bg-gradient-to-br from-violet-500 to-violet-400 self-end rounded-bl-full rounded-tl-full rounded-br-full rounded-tr-md"
      } px-5 py-1  flex flex-col justify-start items-start`}
    >
      {isReceiver && (
        <b className="text-gray-500 text-xs font-medium">{messageItem.user}</b>
      )}

      <span
        className={`${
          isReceiver ? "text-black" : "text-white"
        } text-lg font-regular`}
      >
        {messageItem.message}
      </span>
    </p>
  );
};

export default MessageCard;
