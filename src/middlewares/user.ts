import { NextFunction, Response, Request } from 'express'
import { AppDataSource } from '../config/db'
import { User } from '../entity/User'

interface UserRequest extends Request {
  params: {
    userId?: string
  }
}

export const validateUserExists = async (req: UserRequest, res: Response, next: NextFunction) : Promise<void> => {
  const { userId } = req.params

  if (!userId) {
    res.status(400).json({ error: 'The userId parameter is required.' })
    return 
  }

  try {
    const userRepository = AppDataSource.getRepository(User)

    const user = await userRepository.findOneBy({ id: parseInt(userId)})

    if (!user) {
      res.status(404).json({ error: 'User not found'})
      return
    }

    next()
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' })
  }
}