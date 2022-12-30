import {APIGatewayProxyResult} from 'aws-lambda';

const hello = async (): Promise<APIGatewayProxyResult> => ({
    'statusCode': 200,
    'body': JSON.stringify({
        'message': 'hello world'
    })
});

export {hello};
