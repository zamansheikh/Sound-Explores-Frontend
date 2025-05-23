// src\components\common\SideBar.jsx
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const SideBar = ({ onTitleChange, onSoundListChange, onClose, activeView }) => {
  const [activeButton, setActiveButton] = useState(
    activeView === "friends" ? 2 : 1
  );
  const { signOut } = useAuth();
  useEffect(() => {
    setActiveButton(activeView === "friends" ? 2 : 1);
  }, [activeView]);

  const handleSoundButtonClick = () => {
    onTitleChange("Sound Library");
    onSoundListChange(true);
    setActiveButton(1);
    if (onClose) onClose();
  };

  const handleFriendButtonClick = () => {
    onTitleChange("Friends");
    onSoundListChange(false);
    setActiveButton(2);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex w-full flex-col h-full bg-[#252525]">
      <div className="p-5 border-b border-gray-300 flex justify-between items-center">
        <h1 className="text-xl text-white font-bold">Sound App</h1>
      </div>

      <nav className="flex-1 w-full p-4">
        <ul className="space-y-4">
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleSoundButtonClick}
              className={`px-4 py-2 rounded-md w-full text-left transition-colors duration-200
                ${
                  activeButton === 1 ? "bg-card text-foreground" : "text-white"
                }`}
            >
              Sounds
            </button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button
              onClick={handleFriendButtonClick}
              className={`px-4 py-2 rounded-md w-full text-left transition-colors duration-200
                ${
                  activeButton === 2 ? "bg-card text-foreground" : "text-white"
                }`}
            >
              Friends
            </button>
          </motion.li>
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-gray-300">
        <motion.button
          onClick={handleLogout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 w-full text-left px-4 py-3 hover:bg-gray-600 transition-colors rounded-md text-white"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SideBar;
