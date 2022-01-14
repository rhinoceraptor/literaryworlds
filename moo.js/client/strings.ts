import { version } from '../package.json'

/* eslint-disable no-useless-escape */

export const splashTextBanner = `

\t +-----------------------------------------+
\t |                                _        |
\t |     ____ ___  ____  ____      (_)____   |
\t |    / __ \`__ \/ __ \/ __ \   / / ___/   |
\t |   / / / / / / /_/ / /_/ /   / (__  )    |
\t |  /_/ /_/ /_/\____/\____(_)_/ /____/     |
\t |                        /___/            |
\t |          version ${version}                  |
\t +-----------------------------------------+

`

export const connectionLostBanner = `

\t +--------------------------------------------+
\t |                                            |
\t |  Connection with the server has been lost, |
\t |  please try reloading the page.            |
\t |                                            |
\t +--------------------------------------------+

`

