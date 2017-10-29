from django.db import models
from ordered_model.models import OrderedModel
from stdimage.models import StdImageField
from stdimage.utils import UploadToClassNameDirUUID
from django.utils.html import format_html


class TeamMember(OrderedModel):
    name = models.CharField(max_length=50)
    role = models.CharField(max_length=30)
    description = models.CharField(max_length=200)
    email = models.EmailField()
    image = StdImageField(upload_to=UploadToClassNameDirUUID(), blank=True,
                          variations={'thumbnail': {'width': 100,
                                                    'height': 100,
                                                    "crop": True}})

    def thumbnail(self):
        if not self.image:
            return None
        return self.image.thumbnail

    def image_tag(self):
        if not self.thumbnail():
            return format_html('<p>No Image</p>')
        return format_html('<img src="{}" width=30 height=30 />'
                           .format(self.thumbnail().url))

    image_tag.short_description = 'Image'

    def __str__(self):
        return self.name

    class Meta(OrderedModel.Meta):
        pass
