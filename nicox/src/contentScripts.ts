import { Config } from './config'

const execute = async () => {
  console.log(Config.SERVER_URL)
}

execute()
  .then(() => {
    console.log('finish')
  })
  .catch((e) => {
    console.error(e)
  })
