/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

import axios from 'axios';

export const lambdaHandler = async (event, context) => {
    try {
        // Extracting parameters from the event body
        const { rut, dv, clave } = JSON.parse(event.body);

        if (!rut || !dv || !clave) {
            return {
                statusCode: 400,
                body: JSON.stringify({ 
                    message: 'Missing required parameters: rut, dv, or clave' 
                }, null, 2)
            };
        }

        // Prepare request payload
        const requestBody = `rut=${rut}&dv=${dv}&referencia=https%3A%2F%2Fmisiir.sii.cl%2Fcgi_misii%2Fsiihome.cgi&411=&rutcntr=${rut}-${dv}&clave=${clave}`;

        // Perform the request using axios
        const response = await axios.post(
            "https://zeusr.sii.cl/cgi_AUT2000/CAutInicio.cgi",
            requestBody,
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:135.0) Gecko/20100101 Firefox/135.0",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.5",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Upgrade-Insecure-Requests": "1",
                    "Sec-Fetch-Dest": "document",
                    "Sec-Fetch-Mode": "navigate",
                    "Sec-Fetch-Site": "same-origin",
                    "Sec-Fetch-User": "?1",
                    "Priority": "u=0, i"
                },
                withCredentials: false
            }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data
            }, null, 2) // Prettified output without circular references
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error during login request',
                error: error.message
            }, null, 2) // Prettify the error response
        };
    }
};
