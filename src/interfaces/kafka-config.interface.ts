export interface KafkaConfigSchemaRegistry {
    url: string;
    username: string;
    password: string;
}

export interface KafkaConfigTopics {
    notifications: string;
}

export interface KafkaConfig {
    clientId: string;
    brokers: string[];
    groupId: string;
    topics: KafkaConfigTopics;
    schemaRegistry: KafkaConfigSchemaRegistry;
}
