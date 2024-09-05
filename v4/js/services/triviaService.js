/*************************************************************************************
 * Service provider to fetch records from the Trivia API.
 *************************************************************************************/

/*************************************************************************************
 * Import the ServiceConfiguration class from the serviceConfig.js file.
 * The ServiceConfiguration class is used to provide the API key and the API URL.
 ************************************************************************************/
import { ServiceConfiguration } from "./serviceConfiguration.js";

/********************************************************************
 * Class definition.
 ********************************************************************/
export class TriviaService {
  constructor() {
    this.APIKey = null;
    this.RequestUrl = null;
  }

  /********************************************************************
   * init() | void: This method initializes the service.
   * @param: None
   * @returns: void
   * ********************************************************************/
  async init() {
    var appConfig = new ServiceConfiguration();
    this.APIKey = await this.fetchToken(appConfig.APIAuthUrl);
    this.RequestUrl = appConfig.APIUrl;
  }

  /********************************************************************
   * fetchQuestions() | Promise: This method fetches a new question from the API.
   * @param: None
   * @returns: Promise<string>
   * ********************************************************************/
  async fetchQuestions() {
    let questions = [];
    if (this.RequestUrl !== null && this.APIKey !== null) {
      try {
        const response = await fetch(this.RequestUrl + this.APIKey, {
          method: "GET",
        });
        const jsonResponse = await response.json(); //extract JSON from the http response
        questions = jsonResponse.results;
      } catch (e) {
        console.log("fetch questions error:", e);
      }
    }
    return questions;
  }

  /********************************************************************
   * fetchToken() | Promise: This method fetches a new authentication token from the API.
   * @param: string
   * @returns: Promise<string>
   * ********************************************************************/
  async fetchToken(apiAuthUrl) {
    let token = "";
    try {
      const response = await fetch(apiAuthUrl, {
        method: "GET",
      });
      const jsonResponse = await response.json(); //extract JSON from the http response
      token = jsonResponse.token;
    } catch (e) {
      console.log("Unable to authenticate:", e);
    }
    return token;
  }
}
