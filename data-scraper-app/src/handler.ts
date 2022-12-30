import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';

 const hello = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  return {
      statusCode: 200,
      body: JSON.stringify({
          message: 'hello world',
      }),
   };
};

module.exports = { hello }
