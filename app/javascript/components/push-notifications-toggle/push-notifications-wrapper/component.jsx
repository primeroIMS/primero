import PushNotificationsToggle from "../component";

function Component() {
  const isNotificationsSupported = "Notification" in window;

  if (!isNotificationsSupported) {
    return null;
  }

  return <PushNotificationsToggle isNotificationsSupported />;
}

Component.displayName = "PushNotificationsWrapper";

export default Component;
