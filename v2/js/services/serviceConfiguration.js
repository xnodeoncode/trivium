/*****************************************************************************************
 * SERVICE CONFIGURATION
 * Description: Here you can set the basic configuration for the services in the app.
 * You can also configure third party plugins and set your API keys for example.
 * ****************************************************************************************/
export class ServiceConfiguration {
  constructor() {
    this.APIKey = null;
    this.APIUrl = "https://opentdb.com/api.php?amount=10&token=";
    this.APIAuthUrl = "https://opentdb.com/api_token.php?command=request";
  }
}
