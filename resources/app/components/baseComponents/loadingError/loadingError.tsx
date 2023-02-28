import {Card, Col, Row, Typography} from 'antd';
import React, {useCallback} from 'react';
import Button from '../button/button';

const {Text} = Typography;

export const LoadingError = ({
    errorMessage,
    children,
    retryHandler,
}: {
    errorMessage?: string;
    retryHandler?: () => void;
    children: React.ReactNode;
}): JSX.Element => {
    
    const onRetryHandler = useCallback(() => {
        if (retryHandler) retryHandler();
    }, [retryHandler]);

    if (!errorMessage) return <>{children}</>;

    return (
        <Row justify="center" align="middle" style={{height: '100%'}}>
            <Col>
                <Card role="alert" title={<div>Ошибка загрузки данных</div>} headStyle={{backgroundColor: '#ff7875', textAlign: 'center'}}>
                    <Row justify="center" align="middle">
                        <Col>
                            <Text type="danger">{errorMessage}</Text>
                        </Col>
                    </Row>
                    <Row justify="center" align="middle" style={{paddingTop: '20px'}}>
                        <Col>
                            {retryHandler ? (
                                <Button type={'primary'} onClick={onRetryHandler}>
                                    Попробовать еще раз
                                </Button>
                            ) : (
                                <Text>Попробуйте перезагрузить страницу (F5)</Text>
                            )}
                        </Col>
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};
