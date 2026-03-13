import { PartMeta } from '../parts/types'

// Head components
import CapybaraHead from '../parts/heads/CapybaraHead'
import SkibidiHead from '../parts/heads/SkibidiHead'
import FrogHead from '../parts/heads/FrogHead'
import CatHead from '../parts/heads/CatHead'
import AlienHead from '../parts/heads/AlienHead'

// Body components
import BuffBody from '../parts/bodies/BuffBody'
import RobotBody from '../parts/bodies/RobotBody'
import ChefBody from '../parts/bodies/ChefBody'
import SkaterBody from '../parts/bodies/SkaterBody'
import SuitBody from '../parts/bodies/SuitBody'

// Environment components
import SpaceEnv from '../parts/environments/SpaceEnv'
import PizzaLandEnv from '../parts/environments/PizzaLandEnv'
import UnderwaterEnv from '../parts/environments/UnderwaterEnv'
import CityEnv from '../parts/environments/CityEnv'
import JungleEnv from '../parts/environments/JungleEnv'

export const heads: PartMeta[] = [
  { id: 'capybara', name: 'Capybara', category: 'head', regions: ['left_ear', 'right_ear', 'face', 'snout', 'nose', 'left_eye', 'right_eye', 'left_tooth', 'right_tooth'] },
  { id: 'skibidi', name: 'Skibidi', category: 'head', regions: ['lid', 'bowl', 'handle', 'left_eye_outer', 'right_eye_outer', 'mouth'] },
  { id: 'frog', name: 'Frog King', category: 'head', regions: ['left_eye', 'right_eye', 'face', 'crown'] },
  { id: 'cat', name: 'Laser Cat', category: 'head', regions: ['left_ear', 'right_ear', 'left_inner_ear', 'right_inner_ear', 'face', 'left_eye', 'right_eye'] },
  { id: 'alien', name: 'Alien', category: 'head', regions: ['left_antenna_ball', 'right_antenna_ball', 'head', 'left_eye', 'right_eye'] },
]

export const bodies: PartMeta[] = [
  { id: 'buff', name: 'Buff', category: 'body', regions: ['neck', 'torso', 'left_arm', 'right_arm', 'shorts'] },
  { id: 'robot', name: 'Robot', category: 'body', regions: ['neck', 'torso', 'chest_panel', 'screen', 'left_upper_arm', 'left_joint', 'left_lower_arm', 'left_hand', 'right_upper_arm', 'right_joint', 'right_lower_arm', 'right_hand', 'left_leg', 'right_leg', 'left_foot', 'right_foot'] },
  { id: 'chef', name: 'Chef', category: 'body', regions: ['neck', 'jacket', 'apron', 'left_arm', 'right_arm', 'spatula', 'towel', 'pants'] },
  { id: 'skater', name: 'Skater', category: 'body', regions: ['neck', 'hoodie', 'hood', 'pocket', 'left_arm', 'right_arm', 'pants', 'left_shoe', 'right_shoe', 'skateboard', 'wheel1', 'wheel2'] },
  { id: 'suit', name: 'Suit', category: 'body', regions: ['neck', 'collar', 'jacket', 'left_lapel', 'right_lapel', 'tie', 'pocket_square', 'left_arm', 'right_arm', 'briefcase', 'pants', 'left_shoe', 'right_shoe'] },
]

export const environments: PartMeta[] = [
  { id: 'space', name: 'Space', category: 'environment', regions: ['sky', 'planet', 'planet_ring', 'moon', 'star1', 'star2', 'star3', 'rocket_body', 'rocket_window', 'rocket_flame', 'asteroid', 'ground'] },
  { id: 'pizza_land', name: 'Pizza Land', category: 'environment', regions: ['sky', 'sun', 'mountains', 'mushroom1_cap', 'mushroom1_stem', 'mushroom2_cap', 'mushroom2_stem', 'ground', 'cloud1', 'cloud2', 'olive'] },
  { id: 'underwater', name: 'Underwater', category: 'environment', regions: ['water', 'bubble1', 'bubble4', 'fish1_body', 'fish1_tail', 'fish2_body', 'fish2_tail', 'seaweed1', 'seaweed2', 'coral1', 'coral2', 'ground', 'starfish', 'shell1'] },
  { id: 'city', name: 'City', category: 'environment', regions: ['sky', 'cloud1', 'cloud2', 'building1', 'building2', 'building3', 'building4', 'lamp', 'sign', 'sidewalk', 'street'] },
  { id: 'jungle', name: 'Jungle', category: 'environment', regions: ['sky', 'sun', 'trunk1', 'canopy1', 'trunk2', 'canopy2', 'mushroom1_cap', 'mushroom1_stem', 'mushroom2_cap', 'ground', 'flower1_center', 'flower2_center'] },
]

export const headComponents: Record<string, React.FC<any>> = {
  capybara: CapybaraHead,
  skibidi: SkibidiHead,
  frog: FrogHead,
  cat: CatHead,
  alien: AlienHead,
}

export const bodyComponents: Record<string, React.FC<any>> = {
  buff: BuffBody,
  robot: RobotBody,
  chef: ChefBody,
  skater: SkaterBody,
  suit: SuitBody,
}

export const environmentComponents: Record<string, React.FC<any>> = {
  space: SpaceEnv,
  pizza_land: PizzaLandEnv,
  underwater: UnderwaterEnv,
  city: CityEnv,
  jungle: JungleEnv,
}
