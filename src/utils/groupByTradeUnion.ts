import { type IDoc, type INewDoc } from '@/models/Doc';
import { type INewProt } from '@/models/Protocol';

export const groupByTU = (docs: (IDoc | INewDoc | INewProt)[]) => {
  if (Array.isArray(docs)) {
    const arrOfTU = Array.from(
      new Set(
        docs.map((doc) => {
          if ('tradeunion' in doc && doc.tradeunion) {
            return doc.tradeunion.title;
          }
          return 'Моя организация';
        }),
      ),
    );

    return arrOfTU.map((tu) => ({
      tradeunion: tu,
      docs: docs.filter((doc) => {
        if (tu !== 'Моя организация') {
          return 'tradeunion' in doc && doc.tradeunion?.title === tu;
        }
        return !('tradeunion' in doc) || doc.tradeunion?.title === undefined;
      }),
    }));
  }
};
