import { message } from "antd";

export function notify(type, content) {
    message[type ?? "success"](content);
}
