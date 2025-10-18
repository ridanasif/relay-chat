const MessageCard = ({ messageItem, isReceiver = false }) => {
  return (
    <p
      className={`${
        isReceiver ? "bg-white self-start" : "bg-gradient-to-br from-violet-500 to-violet-400 self-end"
      } px-5 py-1 rounded-md flex flex-col justify-start items-start`}
    >
      {isReceiver && (
        <b className="text-gray-500 text-xs">{messageItem.user}</b>
      )}

      <span className={`${isReceiver ? "text-black" : "text-white"} text-lg`}>
        {messageItem.message}
      </span>
    </p>
  );
};

export default MessageCard;
