import { Link } from "react-router-dom";
import { Icon } from "zmp-ui";
import { getUserInfo } from "zmp-sdk";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [name, setName] = useState<string>("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const { userInfo } = await getUserInfo();
        setName(userInfo.name || "Bạn");
      } catch (e) {
        console.error("Không lấy được tên Zalo:", e);
        setName("Bạn");
      }
    }
    fetchUser();
  }, []);

  const shortcuts = [
    { label: "Tích điểm", to: "/orders", icon: "🏆" },
    { label: "Đổi thưởng", to: "/vouchers", icon: "🎁" },
    { label: "Đặt hàng", to: "/", icon: "🛒" },
    { label: "Liên hệ", to: "/profile", icon: "☎️" },
  ];

  return (
    <div className="bg-brand text-[#180C31] rounded-b-3xl px-4 pt-6 pb-5 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <div className="opacity-90 text-sm">Xin chào,</div>
          <div className="text-2xl font-bold">{name}</div>
        </div>
        <Link
          to="/profile"
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
        >
          <Icon icon="zi-user-circle-solid" />
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-3 mt-5">
        {shortcuts.map((s) => (
          <Link
            key={s.label}
            to={s.to}
            className="bg-[#FFE58F] rounded-2xl py-3 flex flex-col items-center justify-center shadow-soft hover:scale-105 transition"
          >
            <div className="text-2xl">{s.icon}</div>
            <div className="mt-1 text-xs font-semibold text-gray-800">
              {s.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
