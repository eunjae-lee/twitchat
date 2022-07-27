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
}

export interface definitions {
  rooms: {
    /**
     * Format: uuid
     * @description Note:
     * This is a Primary Key.<pk/>
     * @default extensions.uuid_generate_v4()
     */
    id: string;
    /** Format: uuid */
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
    /** Format: timestamp with time zone */
    begin_ts?: string;
    /** Format: timestamp with time zone */
    end_ts?: string;
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
}

export interface operations {}

export interface external {}