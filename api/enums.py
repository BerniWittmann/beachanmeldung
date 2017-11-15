from djchoices import DjangoChoices, ChoiceItem


class TournamentGenderTypes(DjangoChoices):
    female = ChoiceItem()
    male = ChoiceItem()
    mixed = ChoiceItem()


class TeamStateTypes(DjangoChoices):
    waiting = ChoiceItem()
    signed_up = ChoiceItem()
    needs_approval = ChoiceItem()
    denied = ChoiceItem()
