/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/participations": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participations.id"];
          room_id?: parameters["rowFilter.participations.room_id"];
          user_id?: parameters["rowFilter.participations.user_id"];
          created_ts?: parameters["rowFilter.participations.created_ts"];
          role?: parameters["rowFilter.participations.role"];
          status?: parameters["rowFilter.participations.status"];
          picture?: parameters["rowFilter.participations.picture"];
          user_name?: parameters["rowFilter.participations.user_name"];
          full_name?: parameters["rowFilter.participations.full_name"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["participations"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** participations */
          participations?: definitions["participations"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participations.id"];
          room_id?: parameters["rowFilter.participations.room_id"];
          user_id?: parameters["rowFilter.participations.user_id"];
          created_ts?: parameters["rowFilter.participations.created_ts"];
          role?: parameters["rowFilter.participations.role"];
          status?: parameters["rowFilter.participations.status"];
          picture?: parameters["rowFilter.participations.picture"];
          user_name?: parameters["rowFilter.participations.user_name"];
          full_name?: parameters["rowFilter.participations.full_name"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.participations.id"];
          room_id?: parameters["rowFilter.participations.room_id"];
          user_id?: parameters["rowFilter.participations.user_id"];
          created_ts?: parameters["rowFilter.participations.created_ts"];
          role?: parameters["rowFilter.participations.role"];
          status?: parameters["rowFilter.participations.status"];
          picture?: parameters["rowFilter.participations.picture"];
          user_name?: parameters["rowFilter.participations.user_name"];
          full_name?: parameters["rowFilter.participations.full_name"];
        };
        body: {
          /** participations */
          participations?: definitions["participations"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/participations_with_slug": {
    get: {
      parameters: {
        query: {
          slug?: parameters["rowFilter.participations_with_slug.slug"];
          room_id?: parameters["rowFilter.participations_with_slug.room_id"];
          user_id?: parameters["rowFilter.participations_with_slug.user_id"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["participations_with_slug"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
  };
  "/messages": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.messages.id"];
          room_id?: parameters["rowFilter.messages.room_id"];
          user_id?: parameters["rowFilter.messages.user_id"];
          created_ts?: parameters["rowFilter.messages.created_ts"];
          content?: parameters["rowFilter.messages.content"];
          type?: parameters["rowFilter.messages.type"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["messages"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** messages */
          messages?: definitions["messages"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.messages.id"];
          room_id?: parameters["rowFilter.messages.room_id"];
          user_id?: parameters["rowFilter.messages.user_id"];
          created_ts?: parameters["rowFilter.messages.created_ts"];
          content?: parameters["rowFilter.messages.content"];
          type?: parameters["rowFilter.messages.type"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.messages.id"];
          room_id?: parameters["rowFilter.messages.room_id"];
          user_id?: parameters["rowFilter.messages.user_id"];
          created_ts?: parameters["rowFilter.messages.created_ts"];
          content?: parameters["rowFilter.messages.content"];
          type?: parameters["rowFilter.messages.type"];
        };
        body: {
          /** messages */
          messages?: definitions["messages"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/rooms": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.rooms.id"];
          user_id?: parameters["rowFilter.rooms.user_id"];
          title?: parameters["rowFilter.rooms.title"];
          slug?: parameters["rowFilter.rooms.slug"];
          created_ts?: parameters["rowFilter.rooms.created_ts"];
          updated_ts?: parameters["rowFilter.rooms.updated_ts"];
          begin_ts?: parameters["rowFilter.rooms.begin_ts"];
          end_ts?: parameters["rowFilter.rooms.end_ts"];
          user_name?: parameters["rowFilter.rooms.user_name"];
          full_name?: parameters["rowFilter.rooms.full_name"];
          picture?: parameters["rowFilter.rooms.picture"];
          lang?: parameters["rowFilter.rooms.lang"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["rooms"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** rooms */
          rooms?: definitions["rooms"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.rooms.id"];
          user_id?: parameters["rowFilter.rooms.user_id"];
          title?: parameters["rowFilter.rooms.title"];
          slug?: parameters["rowFilter.rooms.slug"];
          created_ts?: parameters["rowFilter.rooms.created_ts"];
          updated_ts?: parameters["rowFilter.rooms.updated_ts"];
          begin_ts?: parameters["rowFilter.rooms.begin_ts"];
          end_ts?: parameters["rowFilter.rooms.end_ts"];
          user_name?: parameters["rowFilter.rooms.user_name"];
          full_name?: parameters["rowFilter.rooms.full_name"];
          picture?: parameters["rowFilter.rooms.picture"];
          lang?: parameters["rowFilter.rooms.lang"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.rooms.id"];
          user_id?: parameters["rowFilter.rooms.user_id"];
          title?: parameters["rowFilter.rooms.title"];
          slug?: parameters["rowFilter.rooms.slug"];
          created_ts?: parameters["rowFilter.rooms.created_ts"];
          updated_ts?: parameters["rowFilter.rooms.updated_ts"];
          begin_ts?: parameters["rowFilter.rooms.begin_ts"];
          end_ts?: parameters["rowFilter.rooms.end_ts"];
          user_name?: parameters["rowFilter.rooms.user_name"];
          full_name?: parameters["rowFilter.rooms.full_name"];
          picture?: parameters["rowFilter.rooms.picture"];
          lang?: parameters["rowFilter.rooms.lang"];
        };
        body: {
          /** rooms */
          rooms?: definitions["rooms"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/rpc/participate_as_user": {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: text */
            param_slug: string;
          };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/rpc/is_room_viewable": {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: uuid */
            param_room_id: string;
          };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/rpc/is_participating": {
    post: {
      parameters: {
        body: {
          args: {
            /** Format: uuid */
            param_room_id: string;
          };
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferParams"];
        };
      };
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
}

export interface definitions {
  participations: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     * @default extensions.uuid_generate_v4()
     */
    id: string;
    /**
     * Format: uuid
     * @description Note:
     * This is a Foreign Key to `participations_with_slug.room_id`.<fk table='participations_with_slug' column='room_id'/>
     */
    room_id: string;
    /**
     * Format: uuid
     * @default auth.uid()
     */
    user_id: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_ts: string;
    /** Format: text */
    role: string;
    /**
     * Format: text
     * @default granted
     */
    status: string;
    /** Format: text */
    picture?: string;
    /** Format: text */
    user_name?: string;
    /** Format: text */
    full_name?: string;
  };
  participations_with_slug: {
    /** Format: text */
    slug?: string;
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     */
    room_id?: string;
    /** Format: uuid */
    user_id?: string;
  };
  messages: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     * @default extensions.uuid_generate_v4()
     */
    id: string;
    /**
     * Format: uuid
     * @description Note:
     * This is a Foreign Key to `participations_with_slug.room_id`.<fk table='participations_with_slug' column='room_id'/>
     */
    room_id: string;
    /**
     * Format: uuid
     * @default auth.uid()
     */
    user_id: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_ts: string;
    /** Format: text */
    content?: string;
    /**
     * Format: text
     * @default text
     */
    type?: string;
  };
  rooms: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     * @default extensions.uuid_generate_v4()
     */
    id: string;
    /**
     * Format: uuid
     * @default auth.uid()
     */
    user_id: string;
    /** Format: text */
    title: string;
    /**
     * Format: text
     * @default lower(SUBSTRING(md5(((''::text || (now())::text) || (random())::text)) FROM 1 FOR 8))
     */
    slug?: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    created_ts?: string;
    /** Format: timestamp with time zone */
    updated_ts?: string;
    /**
     * Format: timestamp with time zone
     * @default now()
     */
    begin_ts: string;
    /**
     * Format: timestamp with time zone
     * @default (now() + '02:00:00'::interval)
     */
    end_ts: string;
    /**
     * Format: text
     * @default
     */
    user_name: string;
    /**
     * Format: text
     * @default
     */
    full_name: string;
    /**
     * Format: text
     * @default
     */
    picture: string;
    /**
     * Format: text
     * @default en
     */
    lang: string;
  };
}

export interface parameters {
  /**
   * @description Preference
   * @enum {string}
   */
  preferParams: "params=single-object";
  /**
   * @description Preference
   * @enum {string}
   */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /**
   * @description Preference
   * @enum {string}
   */
  preferCount: "count=none";
  /** @description Filtering Columns */
  select: string;
  /** @description On Conflict */
  on_conflict: string;
  /** @description Ordering */
  order: string;
  /** @description Limiting and Pagination */
  range: string;
  /**
   * @description Limiting and Pagination
   * @default items
   */
  rangeUnit: string;
  /** @description Limiting and Pagination */
  offset: string;
  /** @description Limiting and Pagination */
  limit: string;
  /** @description participations */
  "body.participations": definitions["participations"];
  /** Format: uuid */
  "rowFilter.participations.id": string;
  /** Format: uuid */
  "rowFilter.participations.room_id": string;
  /** Format: uuid */
  "rowFilter.participations.user_id": string;
  /** Format: timestamp with time zone */
  "rowFilter.participations.created_ts": string;
  /** Format: text */
  "rowFilter.participations.role": string;
  /** Format: text */
  "rowFilter.participations.status": string;
  /** Format: text */
  "rowFilter.participations.picture": string;
  /** Format: text */
  "rowFilter.participations.user_name": string;
  /** Format: text */
  "rowFilter.participations.full_name": string;
  /** @description participations_with_slug */
  "body.participations_with_slug": definitions["participations_with_slug"];
  /** Format: text */
  "rowFilter.participations_with_slug.slug": string;
  /** Format: uuid */
  "rowFilter.participations_with_slug.room_id": string;
  /** Format: uuid */
  "rowFilter.participations_with_slug.user_id": string;
  /** @description messages */
  "body.messages": definitions["messages"];
  /** Format: uuid */
  "rowFilter.messages.id": string;
  /** Format: uuid */
  "rowFilter.messages.room_id": string;
  /** Format: uuid */
  "rowFilter.messages.user_id": string;
  /** Format: timestamp with time zone */
  "rowFilter.messages.created_ts": string;
  /** Format: text */
  "rowFilter.messages.content": string;
  /** Format: text */
  "rowFilter.messages.type": string;
  /** @description rooms */
  "body.rooms": definitions["rooms"];
  /** Format: uuid */
  "rowFilter.rooms.id": string;
  /** Format: uuid */
  "rowFilter.rooms.user_id": string;
  /** Format: text */
  "rowFilter.rooms.title": string;
  /** Format: text */
  "rowFilter.rooms.slug": string;
  /** Format: timestamp with time zone */
  "rowFilter.rooms.created_ts": string;
  /** Format: timestamp with time zone */
  "rowFilter.rooms.updated_ts": string;
  /** Format: timestamp with time zone */
  "rowFilter.rooms.begin_ts": string;
  /** Format: timestamp with time zone */
  "rowFilter.rooms.end_ts": string;
  /** Format: text */
  "rowFilter.rooms.user_name": string;
  /** Format: text */
  "rowFilter.rooms.full_name": string;
  /** Format: text */
  "rowFilter.rooms.picture": string;
  /** Format: text */
  "rowFilter.rooms.lang": string;
}

export interface operations {}

export interface external {}
