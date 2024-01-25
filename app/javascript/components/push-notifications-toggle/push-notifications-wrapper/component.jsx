import PushNotificationsToggle from "../component";

function Component() {
  // Verificar si el API de notificaciones es compatible
  const isNotificationsSupported = "Notification" in window;

  if (!isNotificationsSupported) {
    return null;
  }

  return <PushNotificationsToggle isNotificationsSupported />;
}

Component.displayName = "PushNotificationsWrapper";

export default Component;
