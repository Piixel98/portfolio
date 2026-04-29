import rawPortfolio from './portfolio.json'
import { parsePortfolio } from './portfolioSchema'

const portfolio = parsePortfolio(rawPortfolio)

export default portfolio
