import { JSONDriver } from "../../../db/driver";
import { parseLimit, parseObject } from "../../../utils/responsePipes";

export default async function handler(req, res) {
  const { method } = req;
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseLimit(req.query.limit),
    name: req.query.name || undefined,
  };

  const Character = new JSONDriver("characters");
  await Character.init();

  switch (method) {
    case "GET":
      try {
        var characters;
        if (pageOptions.name) {
          characters = Character.search({ name: pageOptions.name })
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);
        } else {
          characters = Character.findMany()
            .skip(pageOptions.page * pageOptions.limit)
            .limit(pageOptions.limit);
        }
        characters.data = parseObject(characters.data, "games/", "appearances");
       
        res.status(200).json({
          success: true,
          count: characters.data.length,
          data: characters.data,
        });
      } catch (error) {
        res.status(400).json({ success: false, message: error });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
