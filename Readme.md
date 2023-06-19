## Description

This tool is aimed for beautifully explaining and presenting you project along with its resources. You Project page will look just like this page. You can customize the data which should be displayed.

This tool is built using [Node.js](https://nodejs.org/en/) and [Express.js](https://expressjs.com/). It uses [EJS](https://ejs.co/) as its templating engine. It uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Features

- Responsive
- Customizable
- Easy to use
- Easy to deploy
- Easy to maintain
- Easy to update

## How to gain access to this tool

1. Send a email to [anurag.daan@gmail.com](mailto:anurag.daan@gmail.com) with subject as `Project Page Generator Request` and your full name.
2. You will receive a reply with an `API Key`.
3. Now, you can use the API Key to generate your project page(steps are mentioned in next section).

## How to use this tool

1. Currently there is No GUI for this tool. So, you have to use [Postman](https://www.postman.com/) or [Insomnia](https://insomnia.rest/) or any other API testing tool.
2. Will be including GUI in future.

## API Endpoints
- make sure to add `Authorization` header with value as `API Key` received in the email in all the requests.
### 1 Create Project API

- **URL**
  ```http
  POST /create-project
  ```
- Request body structure

  | Parameter    | Type     | Required         | Description                                                         |
  | :----------- | :------- | :--------------- | :------------------------------------------------------------------ |
  | `project_id` | `string` | **Required**     | must be unique and only contain `alphabets`, `numbers`, `-` and `_` |
  | `name`       | `string` | **Required**     | Name of the project                                                 |
  | `links`      | `array`  | **Not Required** | Array of links to be displayed on the project page                  |
  | `images`     | `array`  | **Not Required** | Array of images to be displayed on the project page                 |
  | `videos`     | `array`  | **Not Required** | Array of videos to be displayed on the project page                 |

- Request body example
  ```json
  {
    "project_id": "my_project",
    "name": "My Project",
    "links": [
      {
        "name": "Backend",
        "url": "https://example.com",
        "link_type": "github"
      },
      {
        "name": "Website",
        "url": "https://example.com",
        "link_type": "website"
      },
      {
        "name": "App",
        "url": "https://example.com",
        "link_type": "apk"
      }
    ],
    "images": [
      {
        "src": "https://image.com",
        "alt": "image"
      },
      {
        "src": "https://image.com",
        "alt": "image"
      }
    ],
    "videos": [
      {
        "src": "https://www.youtube.com/embed/video_id",
        "alt": "video"
      }
    ]
  }
  ```

- Note:-
   - `link_type` can be one of the following:-
       - `github`
       - `website`
       - `apk`
   - `src` in `images` and `videos` can be any valid url.
   - `alt` in `images` and `videos` can be any string also it is not required.

- Response body example
    ```json
    {
        "status": "success",
        "message": "Project created successfully",
        "project_id": "my_project"
    }
    ```

- So your Project page will be available at `https://project-page.onrender.com/my_project`

### 2 Add/Update About of Project API
- The tool support markdown for about section.
- You can upload any valid markdown file to the tool and it will be rendered on the project page.
- **URL**
  ```http
  POST /add-md/project_id
  ```
- Request body structure
    | Parameter    | Type     | Required         | Description                                                         |
    | :----------- | :------- | :--------------- | :------------------------------------------------------------------ |
    | `readme` | `file` | **Required**     | a valid readme file |

- Response body example
    ```json
    {
        "project": {
            "project_id": "my_project",
            "name": "My Project",
            "markdown":"your uploaded markdown file text"
            ....
            ....
        }
    }
    ```

### 3 Update Project API
- **URL**
  ```http
  PUT /update-project/project_id
  ```
- Request body structure
    | Parameter    | Type     | Required         | Description                                                         |
    | :----------- | :------- | :--------------- | :------------------------------------------------------------------ |
    | `name`       | `string` | **Not Required** | Name of the project                                                 |
    | `links`      | `array`  | **Not Required** | Array of links to be displayed on the project page                  |
    | `images`     | `array`  | **Not Required** | Array of images to be displayed on the project page                 |
    | `videos`     | `array`  | **Not Required** | Array of videos to be displayed on the project page                 |

- What ever you send in the request body will be updated in the project page.

- Request body example
  ```json
  {
    "name": "My Project updated",
    "links": [
      {
        "name": "Backend",
        "url": "https://example.com",
        "link_type": "github"
      },
      {
        "name": "Website",
        "url": "https://example.com",
        "link_type": "website"
      },
      {
        "name": "App",
        "url": "https://example.com",
        "link_type": "apk"
      }
    ],
  }
  ```
- Above request will update the `name` and `links` of the project and rest fields will remain same.

- Response body example
    ```json
    {
        "name": "My Project updated",
        "links": [
            {
                "name": "Backend",
                "url": "https://example.com",
                "link_type": "github"
            },
            {
                "name": "Website",
                "url": "https://example.com",
                "link_type": "website"
            },
            {
                "name": "App",
                "url": "https://example.com",
                "link_type": "apk"
            }
        ],
        ... rest fields
    }
    ```

### 4 Get Project API
- **URL**
  ```http
  GET /project_id/get
  ```
- No Request Body required
- Response body example
    ```json
    {
        "project": {
            "project_id": "my_project",
            "name": "My Project",
            "links": [
                {
                    "name": "Backend",
                    "url": "https://example.com",
                    "link_type": "github"
                },
                {
                    "name": "Website",
                    "url": "https://example.com",
                    "link_type": "website"
                },
                {
                    "name": "App",
                    "url": "https://example.com",
                    "link_type": "apk"
                }
            ],
            "images": [
                {
                    "src": "https://image.com",
                    "alt": "image"
                },
                {
                    "src": "https://image.com",
                    "alt": "image"
                }
            ],
            "videos": [
                {
                    "src": "https://www.youtube.com/embed/video_id",
                    "alt": "video"
                }
            ]
        }
    }
    ```

## Thanks for using the tool
- If you like the tool please give it a star.