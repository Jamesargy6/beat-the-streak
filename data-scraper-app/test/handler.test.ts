import {hello} from '../src/handler';

describe(
    'hello',
    () => {

        test(
            'happy path',
            async () => {

                const expectedResult = {
                        'statusCode': 200,
                        'body': JSON.stringify({
                            'message': 'hello world'
                        })
                    },
                    result = await hello();
                expect(result).toEqual(expectedResult);

            }
        );

    }
);
