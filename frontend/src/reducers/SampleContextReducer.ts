import {
  SampleContextAction,
  SampleContextType,
} from "../types/SampleContextTypes";

// Using tools such as immer might help with this process.
export default function sampleContextReducer(
  state: SampleContextType,
  action: SampleContextAction,
) {
  switch (action.type) {
    case "EDIT_NAME":
      return {
        ...state,
        teamName: action.value,
      };
    case "EDIT_NUM_TERMS":
      return {
        ...state,
        age: action.value,
      };
    case "EDIT_MEMBERS":
      return {
        ...state,
        members: action.value,
      };
    case "EDIT_IS_ACTIVE":
      return {
        ...state,
        verified: action.value,
      };
    default:
      return state;
  }
}
