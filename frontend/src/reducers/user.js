export const SET_IS_CONNECTED = "SET_IS_CONNECTED";
export const SET_USER_DATA = "SET_USER_DATA";
export const SET_IS_FETCHING_DATA = "SET_IS_FETCHING_DATA";
export const SET_MEMBERS_TO_VIEW = "SET_MEMBERS_TO_VIEW";
export const DELETE_MEMBER_TO_VIEW = "DELETE_MEMBER_TO_VIEW";
export const UPDATE_MEMBER_TO_VIEW = "UPDATE_MEMBER_TO_VIEW";

export const userReducerInitialState = {
  isConnected: false,
  userId: null,
  name: null,
  isFetchingData: false,
  membersToView: [],
};

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_IS_CONNECTED:
      return { ...state, isConnected: action.payload };
    case SET_USER_DATA:
      return { ...state, ...action.payload };
    case SET_IS_FETCHING_DATA:
      return { ...state, isFetchingData: action.payload };
    case SET_MEMBERS_TO_VIEW:
      return {
        ...state,
        membersToView: [...state.membersToView, action.payload],
      };
    case DELETE_MEMBER_TO_VIEW:
      if (action.payload === "all") {
        return { ...state, membersToView: [] };
      }
      return {
        ...state,
        membersToView: state.membersToView.filter(
          (member) => member.id !== action.payload
        ),
      };
    case UPDATE_MEMBER_TO_VIEW:
      return {
        ...state,
        membersToView: state.membersToView.map((member) => {
          if (member.id === action.payload.id) {
            const updatedMember = { ...member, ...action.payload.dataToUpdate };
            return updatedMember;
          }
          return member;
        }),
      };
    default:
      return state;
  }
};

export default userReducer;

export const setIsConnected = (isConnected) => ({
  type: SET_IS_CONNECTED,
  payload: isConnected,
});

export const setUserData = (userData) => ({
  type: SET_USER_DATA,
  payload: userData,
});

export const setIsFetchingData = (isFetching) => ({
  type: SET_IS_FETCHING_DATA,
  payload: isFetching,
});

export const setMembersToView = (newMember) => {
  return { type: SET_MEMBERS_TO_VIEW, payload: newMember };
};
export const deleteMemberToView = (memberId) => {
  if (!memberId) return { type: DELETE_MEMBER_TO_VIEW, payload: "all" };
  return { type: DELETE_MEMBER_TO_VIEW, payload: memberId };
};
export const updateMemberToView = (id, dataToUpdate) => ({
  type: UPDATE_MEMBER_TO_VIEW,
  payload: { id, dataToUpdate },
});
