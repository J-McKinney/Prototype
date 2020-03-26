import axios from "axios";

export default {
  // Gets all sentences
  getSentences: function() {
    return axios.get("/api/sentences");
  },
  // Gets the sentence with the given id
  getSentence: function(id) {
    return axios.get("/api/sentences/" + id);
  },
  // Deletes the sentence with the given id
  deleteSentence: function(id) {
    return axios.delete("/api/sentences/" + id);
  },
  // Saves a sentence to the database
  saveSentence: function(sentenceData) {
    return axios.post("/api/sentences", sentenceData);
  }
};
