import { watch } from "melanke-watchjs";
import listen from "./listeners";
import { renderNews, renderChannels, renderAlert } from "./renders";

const app = () => {
  const state = {
    form: {
      processState: "finished",
      input: {
        url: "",
      },
      errors: {
        message: "",
        type: "",
        style: "",
      },
    },
    data: {
      feeds: [],
      news: [],
      activeFeedId: null,
    },
  };

  const form = document.querySelector(".rss-form");
  const input = document.querySelector("input");
  const btn = document.querySelector(".btn");
  const channelsList = document.querySelector(".rss-channel");
  const itemsList = document.querySelector(".rss-items");
  const alert = document.querySelector(".feedback");

  listen(channelsList, form, input, state);

  watch(state.data, ["activeFeedId", "feeds"], () => renderChannels(channelsList, state));

  watch(state.data, ["activeFeedId", "news"], () => renderNews(itemsList, state));

  watch(state.form.errors, () => renderAlert(alert, state.form.errors));

  watch(state.form, "processState", () => {
    const { processState, errors } = state.form;
    switch (processState) {
      case "error":
        btn.disabled = true;
        input.classList.add("is-invalid");
        errors.type = errors.message;
        errors.style = "danger";
        break;
      case "valid":
        btn.disabled = false;
        input.disabled = false;
        input.classList.remove("is-invalid");
        alert.classList.add("invisible");
        break;
      case "sending":
        btn.disabled = true;
        input.disabled = true;
        errors.type = "warning";
        errors.style = "warning";
        break;
      case "finished":
        input.value = "";
        btn.disabled = true;
        input.disabled = false;
        errors.type = "success";
        errors.style = "success";
        setTimeout(() => {
          input.classList.remove("is-invalid");
          alert.classList.add("invisible");
        }, 5000);
        break;
      default:
        throw new Error(`${state.form.processState}:Unknown state`);
    }
  });
};

export default app;
