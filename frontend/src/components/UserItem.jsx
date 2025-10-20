const UserItem = ({ user, isSelectedUser, isUserOnline, onClick }) => {
  const username = user.username;
  return (
    <div
      className={`py-2 mx-5 flex flex-col cursor-pointer rounded-md ${
        isSelectedUser ? "bg-gray-100" : "hover:bg-gray-100"
      }`}
      key={username}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-3">
        <img
          src="https://lh6.googleusercontent.com/proxy/ZLGihPRfkkerdJBqfRKKFRWQcXDCfMMuuK_6_IDH6Mfhu0VI3Du2L9eOTiz0yKsIftOesQQnj0whQCZFudjFH-cXgBKnebrpknuWtjKkDcRC5Ik"
          width="50"
          height="50"
          className="rounded-full"
        />
        <div>
          <p>@{username}</p>
          <p
            className={`${
              isUserOnline ? "text-green-500" : "text-orange-500"
            } text-xs`}
          >
            {isUserOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default UserItem;
