export const showNotification = (message: string, duration = 3000) => {
    const container = document.getElementById("notificationContainer")!;
    const notif = document.createElement("div");

    notif.innerText = message;
    notif.style.background = "rgba(200, 0, 0, 0.9)";
    notif.style.color = "white";
    notif.style.padding = "8px 12px";
    notif.style.marginBottom = "6px";
    notif.style.borderRadius = "6px";
    notif.style.fontSize = "14px";
    notif.style.fontFamily = "sans-serif";
    notif.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
    notif.style.transition = "opacity 0.5s ease";

    container.appendChild(notif);

    setTimeout(() => {
        notif.style.opacity = "0";
        setTimeout(() => container.removeChild(notif), 500);
    }, duration);
};
