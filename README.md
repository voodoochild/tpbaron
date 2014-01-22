# Trading Post Baron

## Problems

### Lots of information to go through

Would I be better off getting *all* of the pricing data at intervals and churning through it to pick out trades that look promising? Other sites already do this. Might be able to use http://api.gw2tp.com/1/bulk/items.json as a source. It doesn't include item names or images, so those would need to be retrieved some other way.

### Rate limiting

The gw2tp.com API only allows three requests in a short period, and up to 100 items per request. One solution might be to switch to the gw2spidy.com API and request each item as a separate request (assuming that they don't rate limit in a similar fashion). This would be better done proxied by a nodejs server and cached somewhere than done in the browser.

### Adding new items

It's a manual process and a pain in the arse. It would be nice to be able to highlight the name of an item, search it, and get the id in my clipboard in a single step. Could a bookmarklet do that?
