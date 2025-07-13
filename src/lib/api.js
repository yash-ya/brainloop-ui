const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handleResponse = async (response) => {
  if (response.status === 204) {
    return;
  }

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred." }));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

const apiFetch = async (endpoint, options = {}, token = "") => {
  token = !token ? localStorage.getItem("authToken") : token;
  if (!token) {
    throw new Error("Authentication token not found. Please log in again.");
  }
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  return fetch(`${API_BASE_URL}${endpoint}`, config);
};

export const getProblems = async () => {
  const response = await apiFetch("/questions");
  return handleResponse(response);
};

export const getProblemsWithToken = async (token) => {
  const response = await apiFetch("/questions", {}, token);
  return handleResponse(response);
};

export const addProblem = async (problemData) => {
  const response = await apiFetch("/questions", {
    method: "POST",
    body: JSON.stringify(problemData),
  });
  return handleResponse(response);
};

export const updateProblem = async (problemId, updatedData) => {
  const response = await apiFetch(`/questions/${problemId}`, {
    method: "PUT",
    body: JSON.stringify(updatedData),
  });
  return handleResponse(response);
};

export const deleteProblem = async (problemId) => {
  const response = await apiFetch(`/questions/${problemId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
};

export const getProblemById = async (problemId) => {
  const response = await apiFetch(`/questions/${problemId}`);
  return handleResponse(response);
};

export const logRevision = async (problemId, revisionData) => {
  const response = await apiFetch(`/revisions`, {
    method: "POST",
    body: JSON.stringify({
      questionID: problemId,
      ...revisionData,
    }),
  });
  return handleResponse(response);
};

export const getRevisionHistory = async (problemId) => {
  const response = await apiFetch(`/questions/${problemId}/revisions`);
  return handleResponse(response);
};

export const getAllTags = async () => {
  const response = await apiFetch("/tags");
  return handleResponse(response);
};
