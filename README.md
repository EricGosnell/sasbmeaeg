## SASBMEAEG (/ˈsæs.bə.miːɡ/)
### Sequences and Series by Max Eaton and Eric Gosnell

[![Play Now](https://img.shields.io/badge/Play%20Now-sasbmeaeg.gosnell.dev-brightgreen?style=for-the-badge)](https://sasbmeaeg.gosnell.dev)

SASBMEAEG is a 2+ player card game we developed, with the goal of finding the hidden pattern in a sequence of cards. It's
a more mathematical, structured version of the Game of Mao that only includes the mechanical rules (those relating to the
card itself) and none of the performance rules (those relating to the action of a player while playing a card).

One player, the "Yardmaster", defines the secret ruleset for that round which determines whether a played card is correct
or incorrect based on the previous sequence of cards. They then flip over one card (or more depending on the ruleset, 
see below) to start the sequence. The other players, "Yard Dogs", then take turns playing a card, and
the Yardmaster will say if it fits the secret ruleset or not. If it is a valid card, then the card is added to the sequence
and the turn is complete. However, if the card is not valid, the card is added to the sequence and noted as invalid by 
being placed with a slight vertical offset. The player must then draw another card from the deck, and then turn is complete.
After all the Yard Dogs have played once, the Yardmaster then plays a card, and the cycle repeats. The player who runs
out of cards first (or alternatively, whoever first correctly learns the ruleset) becomes the Yardmaster in the next round.
The Yard Dogs are allowed to ask the Yardmaster for hints about the secret ruleset, within reason.

## Meta Rules
1. The secret ruleset must only pertain to physical qualities of the card (number, suit, color, symmetry, pip structure,
etc.). That is to say, given only a ruleset and sequence of cards, it is possible to reconstruct which cards are valid and 
which are invalid.
2. The number of cards flipped at the start must be the exact amount needed for calculating the validity of the next card.
For example, if the secret rule is "greater than the difference of the previous two cards", then there must be two cards
flipped face-up at the start.
3. The secret ruleset must contain no more than 5 operations, where an operation is one of the following: Addition,
subtraction, multiplication, modulus, validity. Exceptions can be made to this rule, as long as the secret ruleset is
sufficiently simple. One example exception is "last 5 cards must be a better poker hand than before".
4. TODO

## Existing Rulesets
The best rulesets are simple yet creative. A Yardmaster who wishes to remain as such should aim to minimize the chance
of a randomly played card being correct, while simultaneously maximizing the chance they can always play a correct card.
You can determine these two chances using the provided Monte Carlo simulation against randomly-playing Yard Dogs.

The following rulesets are some of our favorites we have played, which have been added into the ruleset library:
1. TODO

## Contact
[![Email](https://img.shields.io/badge/Email-sasbmeaeg@gosnell.dev-blue?style=for-the-badge&logo=gmail&logoColor=white)](mailto:sasbmeaeg@gosnell.dev)