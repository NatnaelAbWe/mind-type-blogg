import axios from "axios";

export const filterPaginationData = async ({
  create_new_arr = false,
  state = null,
  data = [],
  page = 1,
  countRoute = "",
  data_to_send = {},
}) => {
  try {
    if (state && !create_new_arr) {
      return {
        ...state,
        results: [...(state.results || []), ...data],
        page,
      };
    }

    const { data: { totalDocs = 0 } = {} } = await axios.post(
      `${import.meta.env.VITE_SERVER_DOMAIN}${countRoute}`,
      data_to_send
    );

    return { results: data, page: 1, totalDocs: totalDocs };
  } catch (err) {
    console.error("Error in filterPaginationData:", err);
    return state || { results: [], page: 1, totalDocs: 0 };
  }
};
